import React, { forwardRef, memo, useCallback } from 'react';
import { TableVirtuoso, TableVirtuosoProps } from 'react-virtuoso';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DraggableScroller from 'shared/ui/table/DraggableTableContainer';
import TableHeadRowVirtuoso from 'shared/ui/table/TableHeadRowVirtuoso';
import { Paper, Stack, TableContainer } from '@mui/material';
import { useTableHeight } from './use-table-height';
import EmptyContent from '../empty-content';

type TableVirtuosoContainerWithHScrolling = {
  data: any[];
  headLabel: { label: string; id?: string }[];
  itemContent: (index: number, item: any) => React.ReactNode;
  fetchNextPage?: () => void;
  dense?: boolean;
  hasNextPage: boolean;
};

const tableComponent = (dense?: boolean) => {
  const TableComponents: TableVirtuosoProps<any, unknown>['components'] = {
    Scroller: DraggableScroller as any,
    Table: (props) => (
      <Table
        size={dense ? 'small' : 'medium'}
        {...props}
        style={{ minWidth: 600, borderCollapse: 'separate' }}
      />
    ),
    TableHead: TableHead as any,
    TableRow,
    TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  };
  return TableComponents;
};

function TableVirtuosoContainer({
  data,
  fetchNextPage,
  headLabel,
  itemContent,
  dense,
  hasNextPage,
}: TableVirtuosoContainerWithHScrolling) {
  const tableHeight = useTableHeight();

  const fetchNextPageHandler = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage && fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);
  if (!data || data.length === 0) {
    return (
      <Stack p={8}>
        <EmptyContent title="No data found" />;
      </Stack>
    );
  }

  return (
    <div style={{ height: tableHeight }}>
      <TableVirtuoso
        data={data}
        components={tableComponent(dense)}
        fixedHeaderContent={() => <TableHeadRowVirtuoso headLabel={headLabel} />}
        itemContent={itemContent}
        endReached={fetchNextPageHandler}
      />
    </div>
  );
}

export default memo(TableVirtuosoContainer);
