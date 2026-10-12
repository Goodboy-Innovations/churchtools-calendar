/**
 * Calendar Grid Component
 */

import React from 'react';
import { format } from 'date-fns';
import { CalendarDay } from '../types/calendar.types';
import { generateCalendarDays, getWeekdayNames } from '../utils/date.utils';
import { Appointment } from '../types/api.types';
import { useI18n } from '../i18n';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  events: Appointment[];
  onSelectDate: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  events,
  onSelectDate,
}) => {
  const t = useI18n();
  const calendarDays = generateCalendarDays(currentMonth, selectedDate, events);
  const weekdayNames = getWeekdayNames(t.locale);

  return (
    <div className="calendar-grid">
      {/* Weekday headers */}
      <div className="weekday-headers">
        {weekdayNames.map((day, index) => (
          <div key={index} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="calendar-days">
        {calendarDays.map((day: CalendarDay, index: number) => (
          <button
            key={index}
            className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${
              day.isSelected ? 'selected' : ''
            } ${day.isToday ? 'today' : ''}`}
            onClick={() => onSelectDate(day.date)}
            aria-label={format(day.date, 'dd.MM.yyyy')}
          >
            <span className="day-number">{format(day.date, 'd')}</span>
            {day.hasEvents && <span className="event-indicator"></span>}
          </button>
        ))}
      </div>
    </div>
  );
};
