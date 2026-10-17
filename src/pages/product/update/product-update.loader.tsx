import { LoaderFunctionArgs } from 'react-router-dom';
import { queryClient } from 'shared/queryClient';
import { getProductByIdQueryOptions } from 'entities/product';

export async function ProductUpdateLoader({ params }: LoaderFunctionArgs) {
  const productId = params.id as string;

  if (!productId) {
    throw new Response('Product ID is required', { status: 400 });
  }

  try {
    const product = await queryClient.fetchQuery(getProductByIdQueryOptions(productId));

    if (!product) {
      throw new Response('Product not found', { status: 404 });
    }

    return {
      product,
    };
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      (status === 404 ? 'Product not found' : 'Failed to load product details');

    throw new Response(message, { status });
  }
}
