import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import TableHeadRowVirtuoso from 'shared/ui/table/TableHeadRowVirtuoso';
import { Stack } from '@mui/material';
import { useTableHeight } from './use-table-height';
import EmptyContent from '../empty-content';
import TableComponentsVirtuoso from './TableComponentsVirtuoso';
import LinearProgressLoading from '../loading/LinearProgressLoading';

type TableVirtuosoContainerProps = {
  data: any[];
  headLabel: { label: string; id?: string }[];
  itemContent: (index: number, item: any) => React.ReactNode;
  fetchNextPage?: () => Promise<any>;
  dense?: boolean;
  hasNextPage: boolean;
  isLoading?: boolean;
  isPending?: boolean;
  isFetching?: boolean;
};

function TableVirtuosoContainer({
  data,
  fetchNextPage,
  headLabel,
  itemContent,
  dense,
  hasNextPage,
  isFetching,
  isLoading,
  isPending,
}: TableVirtuosoContainerProps) {
  const tableHeight = useTableHeight();

  const prevDataLengthRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const components = useMemo(
    () => TableComponentsVirtuoso({ size: dense ? 'small' : 'medium' }),
    [dense]
  );

  const fetchNextPageHandler = useCallback(() => {
    if (!hasNextPage || isFetchingRef.current) return;

    isFetchingRef.current = true;
    prevDataLengthRef.current = data.length;

    const maybePromise = fetchNextPage?.();

    if (maybePromise?.finally) {
      maybePromise.finally(() => {
        if (data.length > prevDataLengthRef.current) {
          isFetchingRef.current = false;
        }
      });
    } else {
      // fallback in case fetchNextPage didn't return a promise
      isFetchingRef.current = false;
    }
  }, [hasNextPage, fetchNextPage, data.length]);

  // Ensure reset if data changes externally (like filter/search)
  useEffect(() => {
    isFetchingRef.current = false;
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <>
        <LinearProgressLoading loading={isLoading || false} />

        <Stack p={8}>
          <EmptyContent title="No data found" />
        </Stack>
      </>
    );
  }

  return (
    <>
      {(isLoading || isFetching || isPending) && <LinearProgressLoading loading />}
      <TableVirtuoso
        style={{ height: tableHeight }}
        data={data}
        components={components as any}
        fixedHeaderContent={() => <TableHeadRowVirtuoso headLabel={headLabel} />}
        itemContent={itemContent}
        endReached={fetchNextPageHandler}
      />
    </>
  );
}

export default TableVirtuosoContainer;
