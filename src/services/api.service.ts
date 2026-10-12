/**
 * ChurchTools API Service
 */

import { ApiResponse, Appointment } from '../types/api.types';
import { DateRange } from '../types/calendar.types';

export class ChurchToolsApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Fetch appointments for a calendar within a date range
   */
  async fetchAppointments(
    calendarId: string,
    dateRange: DateRange
  ): Promise<Appointment[]> {
    try {
      const url = new URL(
        `/api/calendars/${calendarId}/appointments`,
        this.baseUrl
      );
      
      url.searchParams.append('from', dateRange.from);
      url.searchParams.append('to', dateRange.to);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      // Extract base appointments from the response
      return data.data.map((appointment) => appointment);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch appointments: ${error.message}`);
      }
      throw new Error('Failed to fetch appointments: Unknown error');
    }
  }

  /**
   * Update base URL for the service
   */
  updateBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl.replace(/\/$/, '');
  }
}
