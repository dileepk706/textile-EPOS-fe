import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useDeleteRoleMutation } from './role.delete.mutation';
import Iconify from 'shared/ui/iconify';
import { ConfirmDialog } from 'shared/ui/custom-dialog';

interface RoleDeleteButtonProps {
  roleId: string;
  roleName: string;
}

export function RoleDeleteButton({ roleId, roleName }: RoleDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteRoleMutation();

  return (
    <>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => setOpen(true)}>
          <Iconify icon="mingcute:delete-2-fill" />
        </IconButton>
      </Tooltip>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Role"
        content={<>Are you sure you want to delete <strong>{roleName}</strong>?</>}
        action={
          <IconButton
            color="error"
            onClick={() => {
              mutation.mutate(roleId, {
                onSuccess: () => setOpen(false),
              });
            }}
            disabled={mutation.isPending}
          >
            Delete
          </IconButton>
        }
      />
    </>
  );
}