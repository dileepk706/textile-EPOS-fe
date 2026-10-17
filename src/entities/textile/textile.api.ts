import { queryOptions } from '@tanstack/react-query';
import { getTextile } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { ITextile } from './textile.type';

export const getTextileQueryOptions = () =>
  queryOptions({
    queryKey: ['textile'],

    queryFn: async ({ signal }) => {
      const { data } = await getTextile({ signal });
      return data.data;
    },

    initialData: () => queryClient.getQueryData<ITextile>(['textile']),
    initialDataUpdatedAt: () => queryClient.getQueryState(['textile'])?.dataUpdatedAt,
  });
