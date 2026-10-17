import { Frequency } from '@utils/format-time';
import useSearchParamsV2 from '@routes/hook/use-search-params.v2';
import {
  fillArrayDaily,
  fillArrayHourly,
  fillArrayMonthly,
  fillArrayWeekly,
  fillArrayYearly,
} from './freaquencyComparing';
import { removeZeroPairsDaily, restructureArrayForGetCompared } from './helper';

export type FillArrayType = {
  createdOn: number;
  firstData: number;
  secondData: number;
  key?: string;
  label: string;
};

export default function getComparedSetsForChart({
  comparedDataSet,
  currentDataSet,
  frequency,
  isCreatedOn,
  key1,
  key2,
  from,
  to,
  comparisonFrom,
  comparisonTo,
  noComparing,
}: {
  currentDataSet: any[];
  comparedDataSet: any[];
  frequency: Frequency;
  key1: string;
  key2?: string;
  isCreatedOn: boolean;
  from: any;
  to: any;
  comparisonFrom: any;
  comparisonTo: any;
  noComparing?: boolean;
}) {
  let categories = [];
  let currentData: number[] = [];
  let categoriesCompared = [];
  let comparedData: number[] = [];
  let currentDataSecond: number[] = [];
  let comparedDataSecond: number[] = [];

  const rCurr = restructureArrayForGetCompared({
    data: currentDataSet,
    isCreatedOn,
    key1,
    key2,
  });
  const rPrev = restructureArrayForGetCompared({
    data: comparedDataSet,
    isCreatedOn,
    key1,
    key2,
  });

  let curr: FillArrayType[] = [];
  let prev: FillArrayType[] = [];

  if (frequency === 'daily') {
    curr = fillArrayDaily(rCurr, from, to);
    prev = fillArrayDaily(
      rPrev,
      noComparing ? from : comparisonFrom,
      noComparing ? to : comparisonTo
    );
  } else if (frequency === 'hourly') {
    curr = fillArrayHourly(rCurr);
    prev = fillArrayHourly(rPrev);
  } else if (frequency === 'weekly') {
    curr = fillArrayWeekly(rCurr);
    prev = fillArrayWeekly(rPrev);
  } else if (frequency === 'monthly') {
    curr = fillArrayMonthly(rCurr);
    prev = fillArrayMonthly(rPrev);
  } else if (frequency === 'yearly') {
    curr = fillArrayYearly(rCurr);
    prev = fillArrayYearly(rPrev);
  }

  const { filteredComparedData, filteredCurrentData } = removeZeroPairsDaily(curr, prev);

  if (filteredCurrentData.length === 0) {
    categoriesCompared = filteredComparedData.map((e) => e.label);
    comparedData = filteredComparedData.map((e) => e.firstData);
    categories = categoriesCompared;
    currentData = [];
    currentDataSecond = [];
  } else {
    categories = filteredCurrentData.map((e) => e.label);
    currentData = filteredCurrentData.map((e) => e.firstData);
    categoriesCompared = filteredComparedData.map((e) => e.label);
    comparedData = filteredComparedData.map((e) => e.firstData);
    currentDataSecond = filteredCurrentData.map((e) => e.secondData);
    comparedDataSecond = filteredComparedData.map((e) => e.secondData);
  }

  return {
    categories,
    categoriesCompared,
    currentData,
    comparedData,
    currentDataSecond,
    comparedDataSecond,
  };
}

