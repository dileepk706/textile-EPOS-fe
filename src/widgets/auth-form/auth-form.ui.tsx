import { alpha, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoginForm } from 'features/session/login';

export default function AuthFormWidget() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 3, md: 5 },
        height: '100%',
      }}
    >
      <Box
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(10px)',
          boxShadow: theme.shadows[20],
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          width: '100%',
          maxWidth: 480,
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}
