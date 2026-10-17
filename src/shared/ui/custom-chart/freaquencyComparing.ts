import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { FillArrayType } from './getComparedSetsForChart';

dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(localeData);

const isArrayEmpty = (arr: any[]): boolean => !arr || arr.length === 0;

export const fillArrayDaily = (arr: FillArrayType[], from: any, to: any): FillArrayType[] => {
  if (isArrayEmpty(arr)) return [];
  if (!from && !to) return [];

  const fromTimestamp = typeof from === 'string' ? parseInt(from) : from;
  const toTimestamp = typeof to === 'string' ? parseInt(to) : to;

  const salesMap: Record<string, { firstData: any; secondData: any; key: string }> =
    Object.fromEntries(
      arr.map((entry) => {
        const day = dayjs(entry.createdOn).startOf('day').valueOf();
        return [
          day,
          {
            firstData: entry.firstData,
            secondData: entry.secondData,
            key: dayjs(day).format('D'),
            label: dayjs(day).format('D MMM'),
          },
        ];
      })
    );

  // const start = dayjs(arr[0].createdOn).startOf('day');
  // const end = dayjs(arr[arr.length - 1].createdOn).startOf('day');

  const start = dayjs(fromTimestamp).startOf('day');
  const end = dayjs(toTimestamp).startOf('day');

  const result: FillArrayType[] = [];
  let current = start;

  while (current.isSameOrBefore(end)) {
    const time = current.valueOf();
    const existing = salesMap[time];

    result.push({
      createdOn: time,
      firstData: existing ? existing.firstData : 0,
      secondData: existing ? existing.secondData : 0,
      key: dayjs(time).format('D'),
      label: dayjs(time).format('D MMM'),
    });

    current = current.add(1, 'day');
  }

  return result;
};

export const fillArrayHourly = (arr: FillArrayType[]): FillArrayType[] => {
  if (isArrayEmpty(arr)) return [];

  // Map data by hour
  const salesMap: Record<string, { firstData: any; secondData: any }> = Object.fromEntries(
    arr.map((entry) => {
      const hour = dayjs(entry.createdOn).hour();
      return [
        hour.toString(),
        {
          firstData: entry.firstData,
          secondData: entry.secondData,
        },
      ];
    })
  );

  // Use date from first item in array (or today if empty)
  const baseDate = arr.length ? dayjs(arr[0].createdOn).startOf('day') : dayjs().startOf('day');

  const result: FillArrayType[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString();
    const data = salesMap[hourStr];
    const timestamp = baseDate.add(hour, 'hour');

    result.push({
      createdOn: timestamp.valueOf(),
      firstData: data?.firstData ?? 0,
      secondData: data?.secondData ?? 0,
      key: hourStr,
      // label: timestamp.format('h A D MMM'), // e.g., "1 AM 23 May"
      label: timestamp.format('h A'), // e.g., "1 AM 23 May"
    });
  }
  return result;
};

export const fillArrayWeekly = (arr: FillArrayType[]): FillArrayType[] => {
  if (isArrayEmpty(arr)) return [];

  const salesMap: Record<string, { firstData: any; secondData: any }> = Object.fromEntries(
    arr.map((entry) => {
      const weekday = dayjs(entry.createdOn).day(); // 0 (Sun) - 6 (Sat)
      return [
        weekday.toString(),
        {
          firstData: entry.firstData,
          secondData: entry.secondData,
        },
      ];
    })
  );

  const baseDate = arr.length
    ? dayjs(arr[0].createdOn).startOf('week').add(1, 'day') // start from Monday
    : dayjs().startOf('week').add(1, 'day');

  const result: FillArrayType[] = [];

  for (let i = 0; i < 7; i++) {
    const current = baseDate.add(i, 'day');
    const dayStr = current.day().toString();
    const data = salesMap[dayStr];

    result.push({
      createdOn: current.valueOf(),
      firstData: data?.firstData ?? 0,
      secondData: data?.secondData ?? 0,
      key: dayStr,
      label: current.format('ddd D MMM').toLowerCase(), // e.g., "friday 17 may"
    });
  }

  return result;
};

export const fillArrayMonthly = (arr: FillArrayType[]): FillArrayType[] => {
  if (isArrayEmpty(arr)) return [];

  // Create a map of "year-month" => data
  const salesMap: Record<string, any> = {};

  let year = dayjs(arr[0].createdOn).year();

  arr.forEach((entry) => {
    const date = dayjs(entry.createdOn);
    const month = date.month(); // 0-11

    salesMap[month] = {
      firstData: entry.firstData,
      secondData: entry.secondData,
      createdOn: entry.createdOn,
    };
  });

  const result: FillArrayType[] = [];

  for (let month = 0; month < 12; month++) {
    const data = salesMap[month];

    if (data) {
      year = dayjs(data.createdOn).year();

      result.push({
        createdOn: data.createdOn,
        firstData: data?.firstData ?? 0,
        secondData: data?.secondData ?? 0,
        key: month as any,
        label: dayjs(data.createdOn).format('MMM YYYY').toLowerCase(), // e.g., "jan 2023"
      });
    } else {
      result.push({
        createdOn: 0,
        firstData: 0,
        secondData: 0,
        key: month as any,
        label: `${dayjs().month(month).format('MMM')} ${year}`, // e.g., "jan 2023"
      });
    }
  }

  return result;
};

export const fillArrayYearly = (arr: FillArrayType[]): FillArrayType[] => {
  if (isArrayEmpty(arr)) return [];

  const mArr = arr.map((entry, i) => {
    const year = dayjs(entry.createdOn).year();
    return {
      ...entry,
      key: i.toString(),
      label: year.toString(),
    };
  });

  return mArr;
};
