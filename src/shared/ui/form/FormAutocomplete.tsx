import { Autocomplete, TextField } from '@mui/material';
import { formatCamelCase } from '@utils/format-text';

type OptionType = {
  _id: string;
  name: string;
};

type FormAutocompleteProps = {
  label: string;
  placeholder?: string;
  options: OptionType[];
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function FormAutocomplete({
  label,
  placeholder,
  options,
  value,
  onChange,
  error = false,
  helperText = '',
  disabled = false,
  fullWidth = true,
}: FormAutocompleteProps) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option?.name || '')}
      isOptionEqualToValue={(option, val) => option._id === val?._id}
      renderOption={(props, option) => (
        <li {...props} key={option._id}>
          {formatCamelCase(option.name)}
        </li>
      )}
      fullWidth={fullWidth}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
}
