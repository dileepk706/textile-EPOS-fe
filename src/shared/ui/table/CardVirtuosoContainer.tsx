import React, { useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Stack } from '@mui/material';
import EmptyContent from '../empty-content';

type CardListVirtuosoProps = {
  data: any[];
  renderCard: (item: any, index: number) => React.ReactNode;
  fetchNextPage?: () => Promise<any>;
  hasNextPage: boolean;
};

export default function CardVirtuosoContainer({
  data,
  renderCard,
  fetchNextPage,
  hasNextPage,
}: CardListVirtuosoProps) {
  const fetchNextPageHandler = useInfiniteCardList(fetchNextPage, hasNextPage);

  if (!data || data.length === 0) {
    return (
      <Stack p={4}>
        <EmptyContent title="No items found" />
      </Stack>
    );
  }

  return (
    <Virtuoso
      style={{ height: '100vh' }}
      data={data}
      itemContent={(index, item) => <>{renderCard(item, index)}</>}
      endReached={fetchNextPageHandler}
    />
  );
}

export function useInfiniteCardList(fetchNextPage?: () => Promise<any>, hasNextPage?: boolean) {
  const isFetchingRef = useRef(false);

  const handleFetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingRef.current) return;

    isFetchingRef.current = true;
    fetchNextPage?.().finally(() => {
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 500);
    });
  }, [fetchNextPage, hasNextPage]);

  return handleFetchNextPage;
}
