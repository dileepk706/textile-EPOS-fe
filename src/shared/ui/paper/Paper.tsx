import { Paper as MUIPaper, PaperProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = Omit<PaperProps, 'variant'> & { isSelected?: boolean };

export default function paper({ isSelected, children, sx }: Props) {
  return (
    <MUIPaper
      sx={{
        borderRadius: 1,
        border: (theme) =>
          `1px solid ${
            isSelected ? theme.palette.primary.main : alpha(theme.palette.grey[900], 0.16)
          }`,
        boxShadow: isSelected
          ? (theme) => `0 12px 28px ${alpha(theme.palette.primary.main, 0.16)}`
          : 'none',
        backgroundColor: '#e7e5e5',
        ...sx,
      }}
    >
      {children}
    </MUIPaper>
  );
}
