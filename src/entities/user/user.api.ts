import { queryOptions } from '@tanstack/react-query';
import { getUsers, userDetails } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { User } from './user.entity';

export const searchUsersQueryOptions = (sp: any) =>
  queryOptions({
    queryKey: ['user', sp.query],

    queryFn: async ({ signal }): Promise<User> => {
      const { data } = await getUsers(sp, { signal });
      return data.data;
    },

    initialData: () => queryClient.getQueryData(['user', sp.query]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['user', sp.query])?.dataUpdatedAt,
  });

export const getUserByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['user', id],

    queryFn: async ({ signal }): Promise<User> => {
      const { data } = await userDetails(id, { signal });
      return data.data;
    },

    initialData: () => queryClient.getQueryData<User>(['user', id]),
    initialDataUpdatedAt: () => queryClient.getQueryState(['user', id])?.dataUpdatedAt,
  });
