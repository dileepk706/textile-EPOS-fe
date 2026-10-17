import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  readOnly?: boolean;
  startIcon?: string;
  endIcon?: any;
};

export default function RHFTextField({
  name,
  startIcon,
  readOnly,
  helperText,
  type,
  endIcon,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          InputProps={{
            readOnly, // Set the readOnly attribute
            startAdornment: (
              <InputAdornment position="start">
                {startIcon && <Iconify icon={startIcon} />}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {endIcon && <Iconify icon={endIcon} />}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
