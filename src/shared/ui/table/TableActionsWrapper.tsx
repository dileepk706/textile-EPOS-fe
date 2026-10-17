import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface TableActionsWrapperProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function TableActionsWrapper({ children, sx }: TableActionsWrapperProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 2.5 },
        px: { xs: 2, sm: 2.5 },
        pt: { xs: 2, sm: 2.5 },
        pb: { xs: 2.5, sm: 3 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
