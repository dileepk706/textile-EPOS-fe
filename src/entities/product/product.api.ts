import { queryOptions } from '@tanstack/react-query';
import { getProducts, getProductById, getProductBatches } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { Product, ProductFilterParams, ProductBatch } from './product.entity';

export const getProductsQueryOptions = (params?: ProductFilterParams) =>
  queryOptions({
    queryKey: ['products', params],

    queryFn: async ({ signal }): Promise<Product[]> => {
      const { data } = await getProducts(params, { signal });
      const result = data?.data;
      if (Array.isArray(result?.products)) {
        return result.products;
      }
      if (Array.isArray(result)) {
        return result;
      }
      return [];
    },

    initialData: () => queryClient.getQueryData<Product[]>(['products', params]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['products', params])?.dataUpdatedAt,
  });

export const getProductByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id],

    queryFn: async ({ signal }): Promise<Product> => {
      const { data } = await getProductById(id, { signal });
      const result = data?.data;
      return result?.product || result;
    },

    initialData: () => queryClient.getQueryData<Product>(['products', 'detail', id]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['products', 'detail', id])?.dataUpdatedAt,
  });

export const getProductBatchesQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ['products', 'batches', productId],

    queryFn: async ({ signal }): Promise<ProductBatch[]> => {
      const { data } = await getProductBatches(productId, { signal });
      const result = data?.data;
      if (Array.isArray(result?.batches)) {
        return result.batches;
      }
      if (Array.isArray(result)) {
        return result;
      }
      return [];
    },

    enabled: !!productId,
  });
