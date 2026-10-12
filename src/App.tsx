/**
 * Main Calendar Application Component
 */

import React, { useMemo } from 'react';
import { ChurchToolsApiService } from './services/api.service';
import { useCalendarState } from './hooks/useCalendarState';
import { useEvents } from './hooks/useEvents';
import { useResponsive } from './hooks/useResponsive';
import { MonthNavigation } from './components/MonthNavigation';
import { CalendarGrid } from './components/CalendarGrid';
import { EventList } from './components/EventList';
import { useI18n } from './i18n';
import './styles/calendar.scss';

interface AppProps {
  baseUrl: string;
  calendarId: string;
}

const App: React.FC<AppProps> = ({ baseUrl, calendarId }) => {
  const t = useI18n();
  const apiService = useMemo(() => new ChurchToolsApiService(baseUrl), [baseUrl]);
  const { currentMonth, selectedDate, goToNextMonth, goToPreviousMonth, selectDate } =
    useCalendarState();
  const { events, error } = useEvents({ apiService, calendarId, currentMonth });
  const { isMobile } = useResponsive();

  return (
    <div className={`churchtools-calendar ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="calendar-card">
        <MonthNavigation
          currentMonth={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        {error && (
          <div className="error-message">
            <p>{t.loadError(error)}</p>
          </div>
        )}

        <div className="calendar-content">
          <div className="calendar-section">
            <CalendarGrid
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              events={events}
              onSelectDate={selectDate}
            />
          </div>

          <div className="event-list-section">
            <EventList selectedDate={selectedDate} events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
