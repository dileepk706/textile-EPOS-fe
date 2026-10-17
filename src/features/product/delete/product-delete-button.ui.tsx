import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Iconify from 'shared/ui/iconify';
import ConfirmDialog from 'shared/ui/custom-dialog/ConfirmDialog';
import { icons } from 'shared/ui/iconify/icons';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';
import { useDeleteProductMutation } from './product.delete.mutation';

export interface ProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export function ProductDeleteButton({ productId, productName }: ProductDeleteButtonProps) {
  const { enqueueSnackbar } = appSnackbar();
  const [open, setOpen] = useState(false);

  const mutation = useDeleteProductMutation({
    onSuccess: () => {
      setOpen(false);
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(e || 'Failed to delete product', { variant: 'error' });
    },
  });

  const handleDelete = () => {
    mutation.mutate(productId);
  };

  return (
    <>
      <IconButton size="small" color="error" onClick={() => setOpen(true)} title="Delete product">
        <Iconify icon={icons.delete} />
      </IconButton>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Product"
        content={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
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

export default ProductDeleteButton;
