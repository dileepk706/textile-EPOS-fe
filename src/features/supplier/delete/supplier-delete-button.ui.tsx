import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Iconify from 'shared/ui/iconify';
import ConfirmDialog from 'shared/ui/custom-dialog/ConfirmDialog';
import { icons } from 'shared/ui/iconify/icons';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';
import { useDeleteSupplierMutation } from './supplier.delete.mutation';

export interface SupplierDeleteButtonProps {
  supplierId: string;
  supplierName: string;
}

export function SupplierDeleteButton({ supplierId, supplierName }: SupplierDeleteButtonProps) {
  const { enqueueSnackbar } = appSnackbar();
  const [open, setOpen] = useState(false);

  const mutation = useDeleteSupplierMutation({
    onSuccess: () => {
      setOpen(false);
      enqueueSnackbar('Supplier deleted successfully', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(e || 'Failed to delete supplier', { variant: 'error' });
    },
  });

  const handleDelete = () => {
    mutation.mutate(supplierId);
  };

  return (
    <>
      <IconButton size="small" color="error" onClick={() => setOpen(true)} title="Delete supplier">
        <Iconify icon={icons.delete} />
      </IconButton>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Supplier"
        content={`Are you sure you want to delete "${supplierName}"? This action can be undone or restored later.`}
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

export default SupplierDeleteButton;
