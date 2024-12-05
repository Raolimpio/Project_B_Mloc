import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval
} from 'date-fns';
import type { PeriodType } from '@/components/dashboard/reports/period-selector';

export function getDateInterval(date: Date, periodType: PeriodType) {
  switch (periodType) {
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date)
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date)
      };
    case 'year':
      return {
        start: startOfYear(date),
        end: endOfYear(date)
      };
  }
}

export function isDateInPeriod(date: Date, selectedDate: Date, periodType: PeriodType) {
  const interval = getDateInterval(selectedDate, periodType);
  return isWithinInterval(date, interval);
}