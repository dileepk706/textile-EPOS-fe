import { FormProvider, UseFormReturn } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from 'shared/ui/hook-form';

interface SharedRoleFormProps {
  form: UseFormReturn<any>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  submitLabel: string;
}

export function SharedRoleForm({ form, onSubmit, isPending, submitLabel }: SharedRoleFormProps) {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
          <RHFTextField name="name" label="Role Name" />

          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isPending}
            >
              {submitLabel}
            </LoadingButton>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}