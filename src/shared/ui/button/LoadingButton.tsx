/* eslint-disable react/destructuring-assignment */
import MuiLoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';

export default function LoadingButton(
  props: LoadingButtonProps & { appearance?: 'primary' | 'secondary' | 'primary-outlined' }
) {
  if (props.appearance === 'primary')
    return (
      <MuiLoadingButton
        sx={{ borderRadius: 2 }}
        variant="contained"
        loading={props.loading}
        {...props}
      />
    );
  if (props.appearance === 'secondary')
    return (
      <MuiLoadingButton
        sx={{ borderRadius: 13 }}
        variant="contained"
        color="secondary"
        loading={props.loading}
        {...props}
      />
    );
  if (props.appearance === 'primary-outlined')
    return (
      <MuiLoadingButton
        sx={{ borderRadius: 13 }}
        variant="outlined"
        color="primary"
        loading={props.loading}
        {...props}
      />
    );
  return (
    <MuiLoadingButton
      sx={{ borderRadius: 13 }}
      variant="contained"
      loading={props.loading}
      {...props}
    />
  );
}
