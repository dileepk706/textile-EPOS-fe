export const getRolesQueryOptions = () => ['ADMIN', 'MANAGER', 'CASHIER'];

export const getRoleByIdQueryOptions = (id: string) => ({
  queryKey: ['role', id],
  queryFn: async () => ({ id, name: '' } as any),
});
