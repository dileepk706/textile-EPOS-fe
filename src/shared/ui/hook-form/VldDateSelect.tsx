import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Stack, Typography } from '@mui/material';

type Props = {
  onChange: (date: number) => void;
  date: Date | null;
  errorMessage?: string;
  label: string;
};
export default function VldDateSelect({ onChange: changeDob, date, errorMessage, label }: Props) {
  return (
    <Stack direction="column" justifyContent="start" gap={1}>
      <DatePicker
        label={label || 'Date Of Birth'}
        value={date}
        onChange={(newValue) => {
          if (newValue) {
            changeDob(newValue.getTime());
            // field.onChange(newValue.getTime());
          }
        }}
      />
      {errorMessage && (
        <Typography variant="caption" color="red" ml={2}>
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
}
