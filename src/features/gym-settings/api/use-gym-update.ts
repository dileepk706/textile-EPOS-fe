import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGym } from 'shared/api/api.services';
import { UpdateGymDto } from 'shared/api/api.types';
import { useTextilesStore } from 'entities/textile/textile.store';

export function useGymUpdate(gymId: string) {
  const queryClient = useQueryClient();
  const { textile: currentGym, setTextiles: setCurrentGym } = useTextilesStore();

  return useMutation({
    mutationFn: (data: UpdateGymDto) => updateGym(gymId, data),
    onSuccess: (response, variables) => {
      // Invalidate react-query cache
      queryClient.invalidateQueries({ queryKey: ['gym', gymId] });
      queryClient.invalidateQueries({ queryKey: ['gyms'] });

      // Update zustand store
      const updatedGym = response?.data?.data;
      if (updatedGym) {
        setCurrentGym(updatedGym);
      } else if (currentGym) {
        setCurrentGym({ ...currentGym, ...variables });
      }
    },
  });
}
