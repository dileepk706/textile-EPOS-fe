/* eslint-disable no-nested-ternary */
import { CircularProgress, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { useBoolean } from 'shared/hooks/useBoolean';
import Iconify from 'shared/ui/iconify';

type Props = TextFieldProps & {
  inputValue: any;
  valueType: 'number' | 'text';
  apiCallHandler: (val: any) => void;
  loading: boolean;
  startIcon?: string;
  deleteValueHelper?: () => void;
  changeInputValueHelper: (value: any) => void;
  minWidth?: number;
};
function ManualEntryInput({
  inputValue,
  valueType,
  apiCallHandler,
  loading,
  startIcon,
  deleteValueHelper,
  changeInputValueHelper,
  minWidth,
  ...other
}: Props) {
  const isInputValueChange = useBoolean();

  const onsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading && isInputValueChange.value) {
      apiCallHandler(inputValue);
      isInputValueChange.onFalse();
    }
  };
  return (
    <form onSubmit={onsubmit}>
      <TextField
        disabled={loading}
        type={valueType}
        value={inputValue}
        onChange={(e) => {
          changeInputValueHelper(
            e.target.value
            // valueType === 'number' ? parseInt(e.target.value) :
          );
          isInputValueChange.onTrue();
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} color="secondary" />
              ) : isInputValueChange.value ? (
                <Iconify
                  sx={{ cursor: 'pointer', '&:active': { transform: 'scale(0.87)' } }}
                  onClick={() => {
                    apiCallHandler(inputValue);
                    isInputValueChange.onFalse();
                  }}
                  color="Highlight"
                  icon="mdi:tick-circle-outline"
                />
              ) : deleteValueHelper && inputValue ? (
                <Iconify
                  sx={{ cursor: 'pointer', '&:active': { transform: 'scale(0.87)' } }}
                  onClick={deleteValueHelper}
                  color="orangered"
                  icon="zondicons:close-outline"
                />
              ) : null}
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              {startIcon && <Iconify icon={startIcon} />}
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: minWidth || 200,
        }}
        {...other}
      />
    </form>
  );
}

export default ManualEntryInput;
