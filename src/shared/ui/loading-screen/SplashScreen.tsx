import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { LogoText } from 'shared/ui/logo';
//

// ----------------------------------------------------------------------

export default function SplashScreen({
  loadingText,
  sx,
  ...other
}: BoxProps & { loadingText?: string }) {
  return (
    <Box
      sx={{
        right: 0,
        width: 1,
        bottom: 0,
        height: 1,
        zIndex: 9998,
        display: 'flex',
        position: 'fixed',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'background.default' : 'background.paper',
        ...sx,
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        spacing={3}
        sx={{
          position: 'relative',
          width: 1,
          maxWidth: 360,
          px: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 132,
            height: 132,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            component={m.div}
            animate={{ rotate: 360 }}
            transition={{ duration: 4.8, ease: 'linear', repeat: Infinity }}
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: (theme) =>
                `conic-gradient(from 90deg, ${alpha(theme.palette.secondary.main, 0)} 0deg, ${alpha(
                  theme.palette.secondary.main,
                  0.85
                )} 95deg, ${alpha(theme.palette.primary.main, 0.08)} 180deg, ${alpha(
                  theme.palette.secondary.main,
                  0
                )} 360deg)`,
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)',
            }}
          />

          <Box
            component={m.div}
            animate={{ scale: [1, 1.035, 1], opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
            sx={{
              width: 92,
              height: 92,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: (theme) => alpha(theme.palette.common.white, 0.88),
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: (theme) => `0 24px 64px ${alpha(theme.palette.primary.darker, 0.14)}`,
            }}
          >
            <LogoText size="large" color="primary" disabledLink />
          </Box>
        </Box>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            width: '100%',
          }}
        >
          <Stack alignItems="center" spacing={0.75}>
            <Typography
              variant="h4"
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.dark' : 'common.white',
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              TextilesEPOS
              <Box component="span" sx={{ color: 'error.main' }}>
                .
              </Box>
            </Typography>

            {loadingText && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  letterSpacing: 0,
                }}
              >
                {loadingText}
              </Typography>
            )}
          </Stack>
        </m.div>

        <LinearProgress
          color="secondary"
          sx={{
            width: 1,
            maxWidth: 220,
            height: 4,
            borderRadius: 999,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
            },
          }}
        />
      </Stack>
    </Box>
  );
}
