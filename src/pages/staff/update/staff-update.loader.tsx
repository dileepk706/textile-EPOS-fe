import { getUserByIdQueryOptions } from 'entities/user';
import { LoaderFunctionArgs } from 'react-router-dom';
import { queryClient } from 'shared/queryClient';

export async function StaffUpdateLoader({ params }: LoaderFunctionArgs) {
  const userID = params.id as string;

  if (!userID) {
    throw new Response('Staff ID is required', { status: 400 });
  }

  try {
    const user = await queryClient.fetchQuery(getUserByIdQueryOptions(userID));

    if (!user) {
      throw new Response('Staff member not found', { status: 404 });
    }

    return {
      user,
    };
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      (status === 404 ? 'Staff member not found' : 'Failed to load staff details');

    throw new Response(message, { status });
  }
}
