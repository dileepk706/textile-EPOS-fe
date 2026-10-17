import React from 'react';
import {
  Box,
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps,
  Typography,
} from '@mui/material';

type Props = TextFieldProps & {
  errorMessage?: any;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label?: string;
  //   disableErrorHandler:()=>void
};

const TextFieldLabel = React.forwardRef<HTMLDivElement, Props>(
  ({ errorMessage, size = 'small', startIcon, endIcon, label, ...other }, ref) => (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
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
    </Box>
  )
);

TextFieldLabel.displayName = 'TextFieldLabel';

export default TextFieldLabel;
