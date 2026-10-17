import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ReactNode } from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { fCurrency, fNumber } from '@utils/format-number';
import EmptyContent from '../empty-content';

export default function LineComparisonChart({
  categories,
  categoriesCompared,
  currentData,
  comparedData,
  currentDataSecond,
  comparedDataSecond,
  firstSeriesName,
  secondSeriesName,
  title,
  firstDataName,
  secondDataName,
  isFDataCurrency,
  isSDataCurrency,
  dateRangeButton,
}: {
  categories: string[];
  categoriesCompared: string[];
  currentData: number[];
  comparedData: number[];
  currentDataSecond: number[];
  comparedDataSecond: number[];
  firstSeriesName: string;
  secondSeriesName: string;
  title: string;
  firstDataName: string;
  secondDataName?: string;
  isFDataCurrency?: boolean;
  isSDataCurrency?: boolean;
  dateRangeButton?: ReactNode;
}) {
  const formatLabel = (val: number, key?: 's') => {
    const isCurrency = key === 's' ? isSDataCurrency : isFDataCurrency;
    return isCurrency ? fCurrency(val) : fNumber(val);
  };

  const secondValueTooltip = (seriesIndex: number, dataPointIndex: number) => {
    if (seriesIndex === 0) return formatLabel(currentDataSecond[dataPointIndex], 's');
    if (seriesIndex === 1) return formatLabel(comparedDataSecond[dataPointIndex], 's');
    return formatLabel(0, 's');
  };

  const getCategoryLabel = (index: number, seriesIndex: number) =>
    seriesIndex === 0 ? categories[index] : categoriesCompared[index];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: firstDataName,
      },
      labels: {
        formatter: (val) => formatLabel(val),
      },
    },
    tooltip: {
      //   shared: true,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const primaryVal = formatLabel(series[seriesIndex][dataPointIndex]);
        const secondaryVal = secondDataName
          ? secondValueTooltip(seriesIndex, dataPointIndex)
          : null;
        const label = getCategoryLabel(dataPointIndex, seriesIndex);

        return `
          <div style="padding: 10px; font-size: 12px; font-family: inherit;">
            <div style="margin-bottom: 6px; font-weight: bold;">${label}</div>
            <div style="display: flex; justify-content: space-between; gap: 12px;">
              <span>${firstDataName}:</span>
              <span style="font-weight: bold;">${primaryVal}</span>
            </div>
            ${
              secondaryVal
                ? `<div style="display: flex; justify-content: space-between; gap: 12px;">
                  <span>${secondDataName}:</span>
                  <span style="font-weight: bold;">${secondaryVal}</span>
                </div>`
                : ''
            }
          </div>
        `;
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#3B82F6', '#94A3B8'],
  };

  const chartSeries = [
    {
      name: firstSeriesName,
      data: currentData,
    },
    {
      name: secondSeriesName,
      data: comparedData,
    },
  ];

  return (
    <Card>
      <CardHeader
        title={title}
        action={dateRangeButton}
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
      />
      {chartSeries.map((series, index) => (
        <Box key={index} sx={{ px: 3, pb: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: typeof chartOptions.colors?.[index] === 'string' ? chartOptions.colors[index] : 'text.primary' }}
          >
            {series.name} - {formatLabel(series.data.reduce((a, b) => a + b, 0))}
          </Typography>
        </Box>
      ))}
      <CardContent>
        <Box height={350}>
          {currentData.length === 0 && comparedData.length === 0 ? (
            <EmptyContent title={`No ${title} data`} />
          ) : (
            <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="100%" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
