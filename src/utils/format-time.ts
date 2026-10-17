import { format, getTime, formatDistanceToNow } from 'date-fns';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export const getTimeZone = (): string => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return userTimezone;
};

export type Frequency = 'weekly' | 'hourly' | 'daily' | 'monthly' | 'yearly';

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

// Frequency thresholds
const THRESHOLDS = {
  HOURLY: 42 * HOUR_IN_MS, // ~1.75 days
  WEEKLY: 8 * DAY_IN_MS, // 8 days
  DAILY: 32 * DAY_IN_MS, // 1 month approx
  MONTHLY: 365 * DAY_IN_MS, // 1 year
};

export const calculateFrequency = (
  from: number | string | null,
  to: number | string | null,
  label?: string
): Frequency => {
  if (!from || !to) return 'daily';

  if (label === 'Last 7 days') return 'daily';

  const duration = Number(to) - Number(from);

  if (duration < THRESHOLDS.HOURLY) return 'hourly';
  // if (duration < THRESHOLDS.WEEKLY) return 'weekly';
  if (duration < THRESHOLDS.DAILY) return 'daily';
  if (duration < THRESHOLDS.MONTHLY) return 'monthly';

  return 'yearly';
};

export const getDayOfTheWeekByTimestamp = (dateDate: number | Date): string => dayjs(dateDate).format('dddd');

export const dateTime = (inputValue: number): any => {
  const f = dayjs();
  const inputTime = dayjs(inputValue).toDate().getTime();
  const todayStart = f.startOf('date').toDate().getTime();
  const todayEnd = f.endOf('date').toDate().getTime();
  const yesterdayStart = f.startOf('date').subtract(1, 'day').toDate().getTime();
  const yesterdayEnd = f.endOf('date').subtract(1, 'day').toDate().getTime();
  const date9daysBefore = dayjs().startOf('date').subtract(9, 'days').toDate().getTime();
  const date7daysBefore = dayjs().startOf('date').subtract(7, 'days').toDate().getTime();

  let result;

  switch (true) {
    case inputTime >= todayStart && inputTime <= todayEnd:
      result = 'Today';
      break;
    case inputTime >= yesterdayStart && inputTime <= yesterdayEnd:
      result = 'Yesterday';
      break;
    case inputTime > date7daysBefore && inputTime < todayStart:
      result = dayjs(inputValue).format('dddd');
      break;
    case inputTime >= date9daysBefore && inputTime < todayStart:
      result = `${getDaysAgoFromTimestamp(inputTime)} days ago`;
      break;
    default:
      result = dayjs(inputValue).format('D MMM YYYY');
  }
  return result;
};

const getDaysAgoFromTimestamp = (timestamp: number) => {
  const today = dayjs();
  const daysDifference = today.diff(timestamp, 'day');
  return daysDifference;
};

export const getExcelFileName = (title: string): string => `${title} ${new Date().toUTCString().replace(/ /g, '_')}`;

export const dateTime2 = (inputValue: number): string => {
  const f = dayjs();
  const inputTime = dayjs(inputValue).toDate().getTime();
  const todayStart = f.startOf('date').toDate().getTime();
  const todayEnd = f.endOf('date').toDate().getTime();
  const yesterdayStart = f.startOf('date').subtract(1, 'day').toDate().getTime();
  const yesterdayEnd = f.endOf('date').subtract(1, 'day').toDate().getTime();
  const weekStart = f.startOf('week').toDate().getTime();
  const weekEnd = f.endOf('week').toDate().getTime();

  let result;

  switch (true) {
    case inputTime >= todayStart && inputTime <= todayEnd:
      result = 'Today';
      break;
    case inputTime >= yesterdayStart && inputTime <= yesterdayEnd:
      result = 'Yesterday';
      break;
    case inputTime >= weekStart && inputTime <= weekEnd:
      result = dayjs(inputValue).format('dddd');
      break;
    default:
      result = dayjs(inputValue).format('D MMM YYYY');
  }

  return result;
};

export function getDaysInMonth(month: number, year: number) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}
