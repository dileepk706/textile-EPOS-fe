import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateStaffDto } from './staff.update.contracts';
import { queryClient } from 'shared/queryClient';
import { userUpdate } from 'shared/api/api.services';

export const useUpdateStaffMutation = (staffId: string, options?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: (data: Partial<UpdateStaffDto>) => userUpdate(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['user', staffId] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
