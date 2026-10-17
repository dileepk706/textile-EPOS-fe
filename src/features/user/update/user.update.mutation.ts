import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  DefaultError,
} from '@tanstack/react-query';
import { updateSelfUserProfile, getUserProfile } from 'shared/api/api.services';
import { UpdateUserDto } from 'shared/api/api.types';
import { useSessionStore, User } from 'entities/session';

export function useUpdateSelfUserProfileMutation(
  options: Partial<UseMutationOptions<User, DefaultError, UpdateUserDto, unknown>> = {}
) {
  const queryClient = useQueryClient();
  const setUser = useSessionStore((state) => state.setUser);
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['user', 'update-profile', ...mutationKey],
    mutationFn: async (userData: UpdateUserDto) => {
      const response = await updateSelfUserProfile(userData);
      return response.data.data; // response.data is UpdateUserResponseDto (ApiResponse<User>)
    },
    onMutate,
    onSuccess: async (data, variables, context) => {
      // Update global Zustand state with the updated user data returned from the API
      setUser(data);

      // Optionally re-fetch the full user profile to ensure complete synchronization
      try {
        const profileRes = await getUserProfile();
        setUser(profileRes.data.data.user);
      } catch (err) {
        console.error('Failed to sync profile after update:', err);
      }

      onSuccess?.(data, variables, context, undefined as any);
    },
    onError,
    onSettled,
  });
}
