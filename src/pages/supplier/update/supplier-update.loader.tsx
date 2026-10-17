import { LoaderFunctionArgs } from 'react-router-dom';
import { queryClient } from 'shared/queryClient';
import { getSupplierByIdQueryOptions } from 'entities/supplier';

export async function SupplierUpdateLoader({ params }: LoaderFunctionArgs) {
  const supplierId = params.id as string;

  if (!supplierId) {
    throw new Response('Supplier ID is required', { status: 400 });
  }

  try {
    const supplier = await queryClient.fetchQuery(getSupplierByIdQueryOptions(supplierId));

    if (!supplier) {
      throw new Response('Supplier not found', { status: 404 });
    }

    return {
      supplier,
    };
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      (status === 404 ? 'Supplier not found' : 'Failed to load supplier details');

    throw new Response(message, { status });
  }
}
