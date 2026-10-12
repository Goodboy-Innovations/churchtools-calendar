/**
 * Date utility functions using date-fns
 */

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  addDays,
} from 'date-fns';
import type { Locale } from 'date-fns';
import { CalendarDay } from '../types/calendar.types';
import { Appointment } from '../types/api.types';

/**
 * Format a date for API requests (YYYY-MM-DD)
 */
export const formatApiDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format month and year for display (e.g., "LOKAKUU 2025")
 */
export const formatMonthYear = (date: Date, locale: Locale): string => {
  return format(date, 'MMMM yyyy', { locale }).toUpperCase();
};

/**
 * Format time for display (HH:mm)
 */
export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm');
};

/**
 * Format date for display (d.M.yyyy)
 */
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'd.M.yyyy');
};

/**
 * Check if an event spans multiple days
 */
export const isMultiDayEvent = (startDate: string, endDate: string): boolean => {
  const start = startOfDay(parseISO(startDate));
  const end = startOfDay(parseISO(endDate));
  return !isSameDay(start, end);
};

/**
 * Get the next month
 */
export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

/**
 * Get the previous month
 */
export const getPreviousMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

/**
 * Generate calendar grid days (including padding days from previous/next months)
 */
export const generateCalendarDays = (
  currentMonth: Date,
  selectedDate: Date,
  events: Appointment[]
): CalendarDay[] => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map((date) => {
    const dayEvents = events.filter((event) => {
      const eventStart = startOfDay(parseISO(event.calculated.startDate));
      const eventEnd = endOfDay(parseISO(event.calculated.endDate));
      const currentDay = startOfDay(date);
      
      // Check if the current day falls within the event's date range
      return isWithinInterval(currentDay, { start: eventStart, end: eventEnd });
    });

    return {
      date,
      isCurrentMonth: isSameMonth(date, currentMonth),
      isSelected: isSameDay(date, selectedDate),
      isToday: isToday(date),
      hasEvents: dayEvents.length > 0,
      events: dayEvents,
    };
  });
};

/**
 * Get events for a specific date (including multi-day events)
 */
export const getEventsForDate = (
  date: Date,
  events: Appointment[]
): Appointment[] => {
  return events.filter((event) => {
    const eventStart = startOfDay(parseISO(event.calculated.startDate));
    const eventEnd = endOfDay(parseISO(event.calculated.endDate));
    const currentDay = startOfDay(date);
    
    // Check if the current day falls within the event's date range
    return isWithinInterval(currentDay, { start: eventStart, end: eventEnd });
  });
};

/**
 * Get date range for fetching events (current month + padding)
 */
export const getMonthDateRange = (date: Date): { from: string; to: string } => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return {
    from: formatApiDate(calendarStart),
    to: formatApiDate(calendarEnd),
  };
};

/**
 * Get weekday names for header (MA, TI, KE, TO, PE, LA, SU)
 */
export const getWeekdayNames = (locale: Locale): string[] => {
  const date = new Date(2024, 0, 1); // Monday, Jan 1, 2024
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  
  return eachDayOfInterval({
    start: weekStart,
    end: addMonths(weekStart, 0).setDate(weekStart.getDate() + 6) as any,
  }).map((day) => format(day, 'EEEEEE', { locale }).toUpperCase());
};

/**
 * Get date range for upcoming events (from today to N days ahead)
 */
export const getUpcomingDateRange = (days: number) => {
  const from = startOfDay(new Date());
  const to = addDays(from, days - 1);

  return {
    from: formatApiDate(from),
    to: formatApiDate(to),
  };
};

/**
 * Get events for upcoming N days, sorted chronologically and grouped by date
 */
export const getUpcomingEvents = (events: Appointment[]) => {
  const byDay = new Map<string, Appointment[]>();

  events.forEach(e => {
    const d = startOfDay(parseISO(e.calculated.startDate));
    const key = d.toISOString();

    byDay.set(key, [...(byDay.get(key) ?? []), e]);
  });

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dayEvents]) => ({
      date: new Date(key),
      events: dayEvents.sort((a, b) =>
        parseISO(a.calculated.startDate).getTime() -
        parseISO(b.calculated.startDate).getTime()
      ),
    }));
};



/**
 * Format date for list view header (e.g., "MA 15.1.2025")
 */
export const formatListViewDate = (date: Date, locale: Locale): string => {
  return format(date, 'EEEEEE d.M.yyyy', { locale }).toUpperCase();
};
