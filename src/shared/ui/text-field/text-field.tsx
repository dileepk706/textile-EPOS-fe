import React from 'react';
import {
  Box,
  InputAdornment,
  TextField as MuiTextField,
  Stack,
  TextFieldProps,
  Typography,
} from '@mui/material';

type Props = TextFieldProps & {
  label?: string;
  errorMessage?: any;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  //   disableErrorHandler:()=>void
};

const TextField = React.forwardRef<HTMLDivElement, Props>(
  ({ errorMessage, size = 'small', startIcon, label, endIcon, fullWidth, ...other }, ref) => {
    const textFieldComponent = (
      <MuiTextField
        ref={ref}
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errorMessage}
        helperText={errorMessage}
        InputProps={{
          ...(startIcon && {
            startAdornment: (
              <InputAdornment position="start">
                {/* <Iconify icon={startIcon} /> */}
                {startIcon}
              </InputAdornment>
            ),
          }),
          ...(endIcon && {
            endAdornment: (
              <InputAdornment position="end">
                {/* <Iconify icon={endIcon} /> */}
                {endIcon}
              </InputAdornment>
            ),
          }),
        }}
        size={size}
        {...other}
      />
    );

    if (label) {
      return (
        <Stack>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {label}
          </Typography>
          {textFieldComponent}
        </Stack>
      );
    }

    return textFieldComponent;
  }
);

TextField.displayName = 'TextField';

export default TextField;
