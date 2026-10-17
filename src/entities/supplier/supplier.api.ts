import { queryOptions } from '@tanstack/react-query';
import { getSuppliers, getSupplierById } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { Supplier, SupplierFilterParams } from './supplier.entity';

export const getSuppliersQueryOptions = (params?: SupplierFilterParams) =>
  queryOptions({
    queryKey: ['suppliers', params],

    queryFn: async ({ signal }): Promise<Supplier[]> => {
      const { data } = await getSuppliers(params, { signal });
      const result = data?.data;
      if (Array.isArray(result?.suppliers)) {
        return result.suppliers;
      }
      if (Array.isArray(result)) {
        return result;
      }
      return [];
    },

    initialData: () => queryClient.getQueryData<Supplier[]>(['suppliers', params]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['suppliers', params])?.dataUpdatedAt,
  });

export const getSupplierByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['suppliers', 'detail', id],

    queryFn: async ({ signal }): Promise<Supplier> => {
      const { data } = await getSupplierById(id, { signal });
      const result = data?.data;
      return result?.supplier || result;
    },

    initialData: () => queryClient.getQueryData<Supplier>(['suppliers', 'detail', id]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['suppliers', 'detail', id])?.dataUpdatedAt,
  });
