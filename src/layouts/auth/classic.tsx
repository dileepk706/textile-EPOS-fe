// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// assets
import { Grid, Stack, Typography } from '@mui/material';
import { useResponsive } from 'shared/hooks/useResponsive';
import { LogoText } from 'shared/ui/logo';
import { usePathname } from '@routes/hook';
import { pathKeys } from 'shared/routes';
import CustomLink from 'shared/ui/link/CustomeLink';
import { Button } from 'shared/ui';
import bgImage from '../../assets/webp/auth.bgi.webp';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const isLgUp = useResponsive('up', 'lg');
  const path = usePathname();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        // position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto', // Allow the main container to scroll
      }}
    >
      {/* 🖼️ Fixed Background for All Screens */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: { lg: '100vh' },
              justifyContent: { xs: 'space-between', lg: 'flex-end' },
              pr: { xs: 2, lg: 10 },
              pl: { xs: 2, lg: 0 },
            }}
          >
            <Stack spacing={0.5}>
              {!isLgUp ? (
                <LogoText size="small" color="white" />
              ) : (
                <LogoText size="large" color="white" />
              )}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          {/* login appear when lg */}
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {children}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function LoginButton() {
  const theme = useTheme();

  return (
    <Button
      appearance="primary-outlined"
      sx={{
        typography: 'caption',
        color: 'white',
        borderColor: alpha(theme.palette.common.white, 0.3),
        bgcolor: alpha(theme.palette.common.black, 0.1),
        '&:hover': {
          bgcolor: alpha(theme.palette.common.white, 0.1),
          borderColor: 'white',
        },
      }}
      component={CustomLink}
      href={pathKeys.login}
    >
      Login
    </Button>
  );
}
