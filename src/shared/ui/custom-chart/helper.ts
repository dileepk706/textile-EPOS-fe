import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import { Frequency } from '@utils/format-time';
import { FillArrayType } from './getComparedSetsForChart';

dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

export const removeZeroPairsDaily = (arr1: FillArrayType[], arr2: FillArrayType[]) => {
  const map1 = Object.fromEntries(arr1.map((item) => [item.key!, item]));
  const map2 = Object.fromEntries(arr2.map((item) => [item.key!, item]));

  // When arr1 is empty
  if (arr1.length === 0) {
    const filtered = arr2.filter(
      (item): item is FillArrayType =>
        item !== undefined && !(item.firstData === 0 && item.secondData === 0)
    );
    return {
      filteredCurrentData: [],
      filteredComparedData: filtered,
    };
  }

  // When arr2 is empty
  if (arr2.length === 0) {
    const filtered = arr1.filter(
      (item): item is FillArrayType =>
        item !== undefined && !(item.firstData === 0 && item.secondData === 0)
    );
    return {
      filteredCurrentData: filtered,
      filteredComparedData: [],
    };
  }

  const filteredKeys = arr1
    .map((item) => item.key!)
    .filter((key) => {
      const a = map1[key];
      const b = map2[key];
      return !(
        a?.firstData === 0 &&
        a?.secondData === 0 &&
        b?.firstData === 0 &&
        b?.secondData === 0
      );
    });

  const filteredCurrentData = filteredKeys
    .map((key) => map1[key])
    .filter((item): item is FillArrayType => item !== undefined);

  const filteredComparedData = filteredKeys
    .map((key) => map2[key])
    .filter((item): item is FillArrayType => item !== undefined);

  return { filteredCurrentData, filteredComparedData };
};

type IDType = {
  hour?: number;
  day?: number;
  week?: number;
  month: number;
  year: number;
};

export const restructureArrayForGetCompared = ({
  data,
  isCreatedOn,
  key1,
  key2,
}: {
  data: any[];
  key1: string;
  key2?: string;
  isCreatedOn: boolean;
}): FillArrayType[] => {
  if (!data || data.length === 0) return [];

  const arr: any[] = data.map((e) => {
    let createdOn: number;

    if (isCreatedOn) {
      createdOn = e.createdOn;
    } else if (e._id) {
      const id: IDType = e._id;
      const { year, month = 1, day = 1, hour = 0 } = id;

      // Create a UTC timestamp based on available parts
      createdOn = dayjs
        .utc()
        .year(year)
        .month(month - 1) // Month is 0-based in dayjs
        .date(day)
        .hour(hour)
        .minute(0)
        .second(0)
        .millisecond(0)
        .valueOf();
    } else {
      throw new Error('Invalid data format: missing createdOn or _id');
    }

    return {
      createdOn,
      firstData: e[key1] ?? 0,
      secondData: key2 ? e[key2] ?? 0 : 0,
    };
  });
  arr.sort((a, b) => a.createdOn - b.createdOn);
  return arr;
};

export const getCategoriesForChart = (
  arr: any[],
  frequency: Frequency,
  isCreatedOn: boolean = false
): string[] => {
  if (!arr || arr.length === 0) return [];

  return arr.map((e) => {
    let createdOn: number | undefined;

    if (isCreatedOn && typeof e.createdOn === 'number') {
      createdOn = e.createdOn;
    } else if (e._id) {
      const id: IDType = e._id;
      const { year, month = 1, day = 1, hour = 0 } = id;

      createdOn = dayjs
        .utc()
        .year(year)
        .month(month - 1)
        .date(day)
        .hour(hour)
        .minute(0)
        .second(0)
        .millisecond(0)
        .valueOf();
    }

    if (createdOn === undefined) {
      return '';
    }

    switch (frequency) {
      case 'daily':
        return dayjs(createdOn).format('D MMM');
      case 'hourly':
        return dayjs(createdOn).format('h A');
      case 'weekly':
        return dayjs(createdOn).format('ddd D MMM').toLowerCase();
      case 'monthly':
        return dayjs(createdOn).format('MMM YYYY');
      case 'yearly':
        return dayjs(createdOn).format('YYYY');
      default:
        return '';
    }
  });
};

