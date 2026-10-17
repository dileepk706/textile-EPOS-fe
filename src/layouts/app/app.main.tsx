// @mui
import Box, { BoxProps } from '@mui/material/Box';
// hooks
import { useResponsive } from 'shared/hooks/useResponsive';
// components
import { useSettingsContext } from 'shared/ui/settings';
//
import { NAV, HEADER } from '../configLayout';
import { Container } from '@mui/material';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function AppMain({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavMini = settings.themeLayout === 'mini';

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#e3d3d3',
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.045) 0,
            rgba(0, 0, 0, 0.045) 1px,
            transparent 1px,
            transparent 8px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(0, 0, 0, 0.018) 0,
            rgba(0, 0, 0, 0.018) 1px,
            transparent 1px,
            transparent 8px
          )
        `,
        backgroundAttachment: 'fixed',
        // py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(!lgUp && {
          py: `${HEADER.H_MOBILE + SPACING}px`,
        }),
        ...(lgUp && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          pb: `${HEADER.H_DESKTOP + SPACING}px`,
          // width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          // ...(isNavMini && {
          //   width: `calc(100% - ${NAV.W_MINI}px)`,
          // }),
        }),
        ...sx,
      }}
      {...other}
    >
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>{children}</Container>
    </Box>
  );
}
