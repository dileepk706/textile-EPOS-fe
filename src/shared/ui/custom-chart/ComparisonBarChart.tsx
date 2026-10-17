import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { fCurrency, fNumber } from '@utils/format-number';
import EmptyContent from '../empty-content';

export default ({
  categories,
  categoriesCompared,
  currentData,
  comparedData,
  secondDataName,
  firstDataName,
  isFDataCurrency,
  firstSeriesName,
  secondSeriesName,
  title,
  comparedDataSecond,
  currentDataSecond,
  isSDataCurrency,
}: {
  categories: any[];
  categoriesCompared: any[];
  currentData: any[];
  comparedData: any[];
  firstDataName: string;
  secondDataName?: string;
  isFDataCurrency?: boolean;
  isSDataCurrency?: boolean;

  firstSeriesName: string;
  secondSeriesName: string;
  title: string;
  currentDataSecond: number[];
  comparedDataSecond: number[];
}) => {
  const formatLabel = (val: number, d?: any) => {
    if (d === 's') {
      return isSDataCurrency ? fCurrency(val) : fNumber(val);
    }

    return isFDataCurrency ? fCurrency(val) : fNumber(val);
  };
  const secondDataValueProvider = (seriesIndex: number, dataPointIndex: number) => {
    if (seriesIndex === 0) {
      return formatLabel(currentDataSecond[dataPointIndex], 's');
    }
    if (seriesIndex === 1) {
      return formatLabel(comparedDataSecond[dataPointIndex], 's');
    }
    return formatLabel(0);
  };
  const formatTooltipTitle = (dataPointIndex: number, seriesIndex: number) => {
    if (seriesIndex === 0) {
      return categories[dataPointIndex];
    }
    if (seriesIndex === 1) {
      return categoriesCompared[dataPointIndex];
    }
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 1,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: firstDataName,
      },
      labels: {
        formatter(value) {
          return formatLabel(value);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      followCursor: true,
      // shared: true,
      y: {
        formatter(val) {
          return val.toString();
        },
      },
      custom({ series, seriesIndex, dataPointIndex, w }) {
        // const seriesName = w.globals.seriesNames[seriesIndex];

        const value = formatLabel(series[seriesIndex][dataPointIndex]);
        const title = formatTooltipTitle(dataPointIndex, seriesIndex);

        return `
          <div class="apexcharts-tooltip-title" style="font-family: inherit; font-size: 12px; padding: 5px 8px; background-color: #F8F9FA; border-bottom: 1px solid #ddd;">
            ${title}
          </div>
          <div class="apexcharts-tooltip-series-group" style="padding: 8px; display: flex !important; align-items: center; justify-content: space-between;">
            <span class="apexcharts-tooltip-marker" style="width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; background-color: ${
              seriesIndex === 0 ? '#3B82F6' : '#94A3B8'
            };"></span>
            <div class="apexcharts-tooltip-text" style="display: flex; justify-content: space-between; width: 100%;">
              <span class="apexcharts-tooltip-text-label">${`${firstDataName} `}: </span>
              <span class="apexcharts-tooltip-text-value" style="font-weight: bold;">${value}</span>
            </div>
          </div>
          ${
            secondDataName &&
            `<div class="apexcharts-tooltip-series-group" style="padding: 8px; display: flex !important; align-items: center; justify-content: space-between;">
            <span class="apexcharts-tooltip-marker" style="width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; background-color: ${
              seriesIndex === 0 ? '#3B82F6' : '#94A3B8'
            };"></span>
            <div class="apexcharts-tooltip-text" style="display: flex; justify-content: space-between; width: 100%;">
              <span class="apexcharts-tooltip-text-label">${`${secondDataName} `}: </span>
              <span class="apexcharts-tooltip-text-value" style="font-weight: bold;">${secondDataValueProvider(
                seriesIndex,
                dataPointIndex
              )}</span>
            </div>
          </div>`
          }
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
      <CardHeader title={title} />
      {chartSeries.map((series, index) => (
        <Box key={index} sx={{ px: 3, pb: 1 }} typography="caption">
          <span style={{ color: typeof chartOptions.colors?.[index] === 'string' ? chartOptions.colors[index] : 'inherit' }}>
            {series.name} - {formatLabel(series.data.reduce((a: number, b: number) => a + b, 0))}
          </span>
        </Box>
      ))}

      <CardContent>
        <Box height={350}>
          {currentData.length === 0 && comparedData.length === 0 ? (
            <EmptyContent title={`No ${title} data`} />
          ) : (
            <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height="100%" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
