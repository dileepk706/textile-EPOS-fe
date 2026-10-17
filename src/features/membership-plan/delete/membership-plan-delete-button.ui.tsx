import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Iconify from 'shared/ui/iconify';
import ConfirmDialog from 'shared/ui/custom-dialog/ConfirmDialog';
import { icons } from 'shared/ui/iconify/icons';
import { useDeleteMembershipPlanMutation } from './membership-plan.delete.mutation';

export interface MembershipPlanDeleteButtonProps {
  planId: string;
  planName: string;
}

export function MembershipPlanDeleteButton({
  planId,
  planName,
}: MembershipPlanDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteMembershipPlanMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    mutation.mutate(planId);
  };

  return (
    <>
      <Tooltip title="Delete Plan">
        <IconButton size="small" color="error" onClick={() => setOpen(true)}>
          <Iconify icon={icons.delete} width={18} />
        </IconButton>
      </Tooltip>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Membership Plan"
        content={`Are you sure you want to delete "${planName}"? This action cannot be undone.`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
