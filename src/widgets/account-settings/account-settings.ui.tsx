import { Box, Typography, Stack } from '@mui/material';
import AccountSettingsForm from 'features/user/update/user.update-form.ui';

export default function AccountSettingsWidget() {
  return (
    <Box sx={{ width: '100%', mx: 'auto' }}>
      <Stack spacing={4}>
        <AccountSettingsForm />
      </Stack>
    </Box>
  );
}
