/* eslint-disable react/destructuring-assignment */
import { ButtonProps, Button as MUIButton } from '@mui/material';

export default function Button(
  props: ButtonProps & {
    appearance?: 'primary' | 'secondary' | 'primary-outlined';
    borderRadius?: number;
  }
) {
  if (props.appearance === 'primary')
    return (
      <MUIButton sx={{ borderRadius: props.borderRadius || 2 }} variant="contained" {...props} />
    );
  if (props.appearance === 'secondary')
    return (
      <MUIButton
        sx={{ borderRadius: props.borderRadius || 13 }}
        variant="contained"
        color="secondary"
        {...props}
      />
    );
  if (props.appearance === 'primary-outlined')
    return (
      <MUIButton
        sx={{ borderRadius: props.borderRadius || 13 }}
        variant="outlined"
        color="primary"
        {...props}
      />
    );
  return (
    <MUIButton sx={{ borderRadius: props.borderRadius || 13 }} variant="contained" {...props} />
  );
}
