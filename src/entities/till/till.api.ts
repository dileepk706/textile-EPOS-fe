import { queryOptions } from '@tanstack/react-query';
import { getTills, getTillById } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { Till, TillFilterParams } from './till.entity';

export const getTillsQueryOptions = (params?: TillFilterParams) =>
  queryOptions({
    queryKey: ['tills', params],

    queryFn: async ({ signal }): Promise<Till[]> => {
      const { data } = await getTills(params, { signal });
      const result = data?.data;
      if (Array.isArray(result?.tills)) {
        return result.tills;
      }
      if (Array.isArray(result)) {
        return result;
      }
      return [];
    },

    initialData: () => queryClient.getQueryData<Till[]>(['tills', params]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['tills', params])?.dataUpdatedAt,
  });

export const getTillByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['tills', 'detail', id],

    queryFn: async ({ signal }): Promise<Till> => {
      const { data } = await getTillById(id, { signal });
      const result = data?.data;
      return result?.till || result;
    },

    initialData: () => queryClient.getQueryData<Till>(['tills', 'detail', id]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['tills', 'detail', id])?.dataUpdatedAt,
  });
