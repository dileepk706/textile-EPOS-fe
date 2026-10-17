import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { formatCamelCase, formatHyphenStringV2 } from '@utils/format-text';

type Props = {
  error?: string;
  options: string[];
  value?: string;
  label?: string;
  handleChangeValue: (vslue: string) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  minWidth?: number;
  hyphenString?: boolean;
};
export default function VldSelect({
  error,
  options,
  label,
  value,
  size,
  handleChangeValue: handleChangeValeu,
  fullWidth,
  minWidth,
  hyphenString,
}: Props) {
  return (
    <>
      {hyphenString ? (
        <FormControl
          fullWidth={fullWidth}
          required
          sx={{ minWidth: minWidth || 120, padding: 0, margin: 0 }}
          error={!!error}
        >
          <InputLabel
            id={error ? 'demo-simple-select-error-label' : 'demo-simple-select-required-label'}
          >
            {label}
          </InputLabel>
          <Select
            labelId={error ? 'demo-simple-select-error-label' : 'demo-simple-select-required-label'}
            id={error ? 'demo-simple-select-error' : 'demo-simple-select-required'}
            value={[value]}
            label={label}
            onChange={(event) => {
              const vv = Array.isArray(event.target.value)
                ? (event.target.value as (string | undefined)[]).filter(
                    (v): v is string => typeof v === 'string'
                  )
                : [event.target.value as string];
              handleChangeValeu(vv.join(','));
            }}
            size={size}
            renderValue={(selected: any) =>
              selected.map((vvv: any) => formatHyphenStringV2(vvv)).join(', ')
            }
          >
            <MenuItem />
            {options.map((e, i) => (
              <MenuItem key={i} value={e}>
                {formatHyphenStringV2(e)}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      ) : (
        <FormControl
          fullWidth={fullWidth}
          required
          sx={{ minWidth: minWidth || 120, padding: 0, margin: 0 }}
          error={!!error}
        >
          <InputLabel
            id={error ? 'demo-simple-select-error-label' : 'demo-simple-select-required-label'}
          >
            {label}
          </InputLabel>
          <Select
            labelId={error ? 'demo-simple-select-error-label' : 'demo-simple-select-required-label'}
            id={error ? 'demo-simple-select-error' : 'demo-simple-select-required'}
            value={[value]}
            label={label}
            onChange={(event) => {
              const vvvvv = Array.isArray(event.target.value)
                ? (event.target.value as (string | undefined)[]).filter(
                    (v): v is string => typeof v === 'string'
                  )
                : [event.target.value as string];
              handleChangeValeu(vvvvv.join(','));
            }}
            size={size}
            renderValue={(selected: any) =>
              selected.map((vvvv: any) => formatCamelCase(vvvv)).join(', ')
            }
          >
            <MenuItem />
            {options.map((e, i) => (
              <MenuItem key={i} value={e}>
                {formatCamelCase(e)}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      )}
    </>
  );
}
