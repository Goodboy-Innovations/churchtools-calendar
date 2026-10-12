/**
 * Entry point for the ChurchTools Calendar application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ListViewApp } from './components/ListViewApp';
import { I18nContext, getTranslations } from './i18n';

// This function will be called by WordPress / HubSpot to initialize the calendar
declare global {
  interface Window {
    ChurchToolsCalendar: {
      init: (
        containerId: string,
        baseUrl: string,
        calendarId: string,
        view?: string,
        language?: string
      ) => void;
    };
  }
}

window.ChurchToolsCalendar = {
  init: (
    containerId: string,
    baseUrl: string,
    calendarId: string,
    view: string = 'calendar',
    language?: string
  ) => {
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    const root = ReactDOM.createRoot(container);
    // Fall back to the page language (<html lang="...">) when no language is given
    const translations = getTranslations(language || document.documentElement.lang.slice(0, 2));
    
    // Route to the correct component based on view type
    root.render(
      <React.StrictMode>
        <I18nContext.Provider value={translations}>
          {view === 'list' ? (
            <ListViewApp baseUrl={baseUrl} calendarId={calendarId} />
          ) : (
            <App baseUrl={baseUrl} calendarId={calendarId} />
          )}
        </I18nContext.Provider>
      </React.StrictMode>
    );
  },
};
