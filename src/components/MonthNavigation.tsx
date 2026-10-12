/**
 * Month Navigation Component
 */

import React from 'react';
import { getPreviousMonth, getNextMonth } from '../utils/date.utils';
import { format } from 'date-fns';
import { useI18n } from '../i18n';

interface MonthNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}) => {
  const t = useI18n();
  const previousMonth = getPreviousMonth(currentMonth);
  const nextMonth = getNextMonth(currentMonth);

  const previousMonthName = format(previousMonth, 'LLLL', { locale: t.locale });
  const nextMonthName = format(nextMonth, 'LLLL', { locale: t.locale });

  return (
    <div className="month-navigation">
      <button
        className="nav-button prev"
        onClick={onPreviousMonth}
        aria-label={t.previousMonth(previousMonthName)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="month-name">{previousMonthName}</span>
      </button>

      <h2 className="current-month">{format(currentMonth, 'LLLL yyyy', { locale: t.locale }).toUpperCase()}</h2>

      <button
        className="nav-button next"
        onClick={onNextMonth}
        aria-label={t.nextMonth(nextMonthName)}
      >
        <span className="month-name">{nextMonthName}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
