/**
 * List View Application Component
 * Displays upcoming events in a chronological list format
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ChurchToolsApiService } from '../services/api.service';
import { ListViewEventItem } from './ListViewEventItem';
import { getUpcomingDateRange, getUpcomingEvents, formatListViewDate } from '../utils/date.utils';
import { Appointment } from '../types/api.types';
import { useI18n } from '../i18n';
import '../styles/calendar.scss';

interface ListViewAppProps {
  baseUrl: string;
  calendarId: string;
}

interface ListViewConfig {
  days: number;
  scale: number;
  disable: {
    description: boolean;
    location: boolean;
    link: boolean;
    today: boolean;
  };
}

/**
 * Parse URL query parameters for list view configuration
 */
const useListViewConfig = (): ListViewConfig => {
    const params = new URLSearchParams(window.location.search);
    
    // Parse days parameter (default: 7)
    const daysParam = params.get('days');
    const days = daysParam ? Math.max(1, Math.min(30, parseInt(daysParam, 10))) : 7;
    
    // Parse scale parameter (default: 1.0)
    const scaleParam = params.get('scale');
    const scale = scaleParam ? Math.max(0.5, Math.min(5, parseFloat(scaleParam))) : 1.0;
    
    // Parse disable parameter (comma-separated list)
    const disableParam = params.get('disable');
    const disabledFeatures = disableParam ? disableParam.split(',').map(f => f.trim().toLowerCase()) : [];
    
    return {
      days: (isNaN(days) ? 7 : days) + (disabledFeatures.includes('today') ? 1 : 0),
      scale: isNaN(scale) ? 1.0 : scale,
      disable: {
        description: disabledFeatures.includes('description'),
        location: disabledFeatures.includes('location'),
        link: disabledFeatures.includes('link'),
        today: disabledFeatures.includes('today'),
      },
    };
};

export const ListViewApp: React.FC<ListViewAppProps> = ({ baseUrl, calendarId }) => {
  const t = useI18n();
  const apiService = useMemo(() => new ChurchToolsApiService(baseUrl), [baseUrl]);
  const config = useListViewConfig();
  const [events, setEvents] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const dateRange = getUpcomingDateRange(config.days);
        const fetchedEvents = await apiService.fetchAppointments(calendarId, dateRange);
        setEvents(fetchedEvents);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
        setError(errorMessage);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [apiService, calendarId, config?.days]);

  // Group and sort events by day
  const groupedEvents = useMemo(() => {

    const allGroupedEvents = getUpcomingEvents(events);
    
    // Filter out today if disabled
    if (config.disable.today) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return allGroupedEvents.filter(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() !== today.getTime();
      });
    }
    
    return allGroupedEvents;
  }, [events, config.days, config.disable.today]);

  // Apply text scale to the container
  useEffect(() => {
    containerRef.current?.style.setProperty('--lv-scale', config.scale.toString());
  }, [config.scale]);


  return (
    <div className="churchtools-calendar listview" ref={containerRef}>
      <div className="calendar-card listview-card">

        {error && (
          <div className="error-message">
            <p>{t.loadError(error)}</p>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t.loading}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="listview-content">
            {groupedEvents.length === 0 ? (
              <div className="no-events">
                <p>{t.noUpcomingEvents(config.days)}</p>
              </div>
            ) : (
              groupedEvents.map((day, index) => (
                <div key={index} className="listview-day-group">
                  <div className="listview-day-header">
                    <h3>{formatListViewDate(day.date, t.locale)}</h3>
                    {/* <div className="day-event-count">{day.events.length}</div> */}
                  </div>
                  <div className="listview-events">
                    {day.events.map((event) => (
                      <ListViewEventItem
                        key={event.base.id}
                        eventData={event}
                        expanded={event.base.id === expandedEvent}
                        setExpanded={setExpandedEvent}
                        disableFlags={config.disable}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
