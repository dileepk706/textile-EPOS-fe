import { Stack } from '@mui/material';

export default function AppToolBar({ children }: any) {
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pb: 1,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      {children}
    </Stack>
  );
}
