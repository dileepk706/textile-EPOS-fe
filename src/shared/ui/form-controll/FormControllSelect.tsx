import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { formatCamelCase } from '@utils/format-text';

export default function FormControlSelect({
  onChangeValue,
  title,
  value,
  values,
  size,
  fullWidth,
}: {
  value: string;
  title: string;
  onChangeValue: (v: string) => void;
  values: string[];
  size?: 'small' | 'medium';
  fullWidth?: any;
}) {
  return (
    <FormControl
      size={size || 'medium'}
      sx={{
        flexShrink: 0,
        width: fullWidth ? '100%' : { xs: 1, md: 180 },
      }}
    >
      <InputLabel>{formatCamelCase(title)}</InputLabel>

      <Select
        input={<OutlinedInput label={title} />}
        value={[value]}
        onChange={(event: SelectChangeEvent<string[]>) =>
          onChangeValue(event.target.value as string)
        }
        renderValue={(selected: any) => selected.map((v: any) => formatCamelCase(v)).join(', ')}
        sx={{ textTransform: 'capitalize' }}
      >
        {values.map((option) => (
          <MenuItem key={option} value={option}>
            {formatCamelCase(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
