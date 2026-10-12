/**
 * UI translations (fi / en)
 */

import { createContext, useContext } from 'react';
import type { Locale } from 'date-fns';
import { fi, enGB } from 'date-fns/locale';

export type Language = 'fi' | 'en';

export interface Translations {
  locale: Locale;
  event: string;
  allDay: string;
  eventsIn: (monthName: string) => string;
  noEventsForDay: string;
  noUpcomingEvents: (days: number) => string;
  loading: string;
  loadError: (error: string) => string;
  tapForDetails: string;
  previousMonth: (monthName: string) => string;
  nextMonth: (monthName: string) => string;
}

const translations: Record<Language, Translations> = {
  fi: {
    locale: fi,
    event: 'Tapahtuma',
    allDay: 'Koko päivä',
    eventsIn: (monthName) => `TAPAHTUMAT ${monthName}`,
    noEventsForDay: 'Ei tapahtumia tälle päivälle',
    noUpcomingEvents: (days) => `Ei tulevia tapahtumia seuraavan ${days} päivän aikana.`,
    loading: 'Ladataan tapahtumia...',
    loadError: (error) => `Virhe ladattaessa tapahtumia: ${error}`,
    tapForDetails: 'Napauta tapahtumaa nähdäksesi lisätietoja',
    previousMonth: (monthName) => `Edellinen kuukausi: ${monthName}`,
    nextMonth: (monthName) => `Seuraava kuukausi: ${monthName}`,
  },
  en: {
    locale: enGB,
    event: 'Event',
    allDay: 'All day',
    eventsIn: (monthName) => `EVENTS IN ${monthName}`,
    noEventsForDay: 'No events on this day',
    noUpcomingEvents: (days) => `No upcoming events in the next ${days} days.`,
    loading: 'Loading events...',
    loadError: (error) => `Error loading events: ${error}`,
    tapForDetails: 'Tap the event for more details',
    previousMonth: (monthName) => `Previous month: ${monthName}`,
    nextMonth: (monthName) => `Next month: ${monthName}`,
  },
};

export const getTranslations = (language?: string): Translations =>
  translations[language === 'en' ? 'en' : 'fi'];

export const I18nContext = createContext<Translations>(translations.fi);

export const useI18n = (): Translations => useContext(I18nContext);
