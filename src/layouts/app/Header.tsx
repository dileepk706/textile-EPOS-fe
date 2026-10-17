// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// theme
import { bgBlur } from '@theme/css';
// components
// import { LogoPng } from 'shared/ui/logo';

import Iconify from 'shared/ui/iconify';
//
import { HEADER } from '../configLayout';
import TextilesLabel from '../_common/TextileLabel';
import { LogoText } from 'shared/ui/logo';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        bgcolor: 'primary.dark',
        boxShadow: 'none',
        borderBottom: `solid 1px ${alpha(theme.palette.divider, 0.08)}`,
        // ...bgBlur({
        //   color: theme.palette.primary.dark,
        //   opacity: 0.8,
        // }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        width: '100%',
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          justifyContent: 'space-between',
        }}
      >
        <IconButton onClick={onOpenNav} sx={{ color: 'secondary.main' }}>
          <Iconify icon="solar:hamburger-menu-outline" />
        </IconButton>

        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <LogoText size="small" color="white" />
        </Box>

        <TextilesLabel mini />
      </Toolbar>
    </AppBar>
  );
}
