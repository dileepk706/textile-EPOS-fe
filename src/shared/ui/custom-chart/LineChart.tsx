import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { fCurrency, fNumber } from '@utils/format-number';
import EmptyContent from '../empty-content';

export default function ({
  categories,
  title,
  firstDataName,
  isDataCurrency,
  chartSeries,
  colors,
}: {
  categories: string[];
  title: string;
  firstDataName: string;
  isDataCurrency?: boolean;
  chartSeries: {
    name: string;
    data: number[];
  }[];
  colors?: string[];
}) {
  const formatLabel = (val: number) => (isDataCurrency ? fCurrency(val) : fNumber(val));

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false, // removes all toolbar controls
      },
      zoom: {
        enabled: false,
      },
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
      shared: true,
      y: {
        formatter: (value: number, p: any) => {
          if (typeof value !== 'undefined') {
            if (p.seriesIndex === 0) {
              return `${fCurrency(value.toFixed(0))}`;
            }
            if (p.seriesIndex === 1) {
              return `${fCurrency(value.toFixed(0))}`;
            }
          }
          return `${fCurrency(0)}`;
        },
      },
    },
    legend: {
      position: 'top',
    },
    colors: colors || ['#3B82F6', '#94A3B8'],
  };

  return (
    <Card>
      <CardHeader title={title} />
      <Stack sx={{ px: 3, pb: 1 }}>
        {chartSeries.map((series, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{ color: colors ? colors[index] : 'text.primary' }}
          >
            {series.name} - {formatLabel(series.data.reduce((a, b) => a + b, 0))}
          </Typography>
        ))}
      </Stack>
      <CardContent>
        <Box height={350}>
          {!chartSeries || chartSeries.length == 0 || chartSeries[0]?.data?.length === 0 ? (
            <EmptyContent title={`No ${title} data`} />
          ) : (
            <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="100%" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
