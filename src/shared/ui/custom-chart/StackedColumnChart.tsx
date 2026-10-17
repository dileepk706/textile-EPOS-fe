import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { fCurrency, fNumber } from '@utils/format-number';
import EmptyContent from '../empty-content';

export default function StackedColumnChart({
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
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          download: false, // ✅ removes PNG/SVG/CSV export
        },
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'top',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          total: {
            // enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'category',
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
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: 0,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false, // <-- add this line to fix the error
      y: {
        formatter: (value: number) => formatLabel(value),
      },
    },
    colors: colors || ['#0066cc', '#cc0000', '#f59e0b'],
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box height={350}>
          {!chartSeries || chartSeries.length === 0 || chartSeries[0]?.data?.length === 0 ? (
            <EmptyContent title={`No ${title} data`} />
          ) : (
            <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height="100%" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
