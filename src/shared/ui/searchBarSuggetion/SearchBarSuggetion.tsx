import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

interface Props {
  title?: string;
  options?: string[];
}
export default function SearchBarSuggetion({ title, options }: Props) {
  if (!options) options = [''];
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={options?.map((option) => option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={title}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
  );
}
