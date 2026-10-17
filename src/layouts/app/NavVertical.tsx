import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useResponsive } from 'shared/hooks/useResponsive';
import { LogoText } from 'shared/ui/logo';
import Scrollbar from 'shared/ui/scrollbar';
import { usePathname } from '@routes/hook';
import { NavSectionVertical } from 'shared/ui/nav-section';
import { NAV } from '../configLayout';
import { useNavData } from './ConfigNavigation';
import NavToggleButton from '../_common/NavToggleButton';
import TextilesLabel from '../_common/TextileLabel';
import LogoutButton from '../_common/LogoutButton';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
  isBilling?: boolean;
};

export default function NavVertical({ openNav, onCloseNav, isBilling }: Props) {
  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData(isBilling);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        bgcolor: 'primary.dark',
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack sx={{ px: 2, pt: 3, pb: 2, gap: 1.5 }}>
        <LogoText size="small" />
        <TextilesLabel />
      </Stack>

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: 'admin',
          itemRadius: 8,
          itemPadding: '8px 12px 8px 12px',
          itemGap: 4,
          iconSize: 24,
        }}
        sx={{
          pr: 2,
          '& .nav-item': {
            color: 'grey.500',
            '&.active': {
              color: 'common.white',
              bgcolor: alpha('#ffffff', 0.08),
              '& .nav-icon': {
                color: 'secondary.main',
              },
            },
            '& .nav-icon': {
              color: 'secondary.main',
            },
          },
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ pb: 2 }}>
        <LogoutButton />
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
        zIndex: 999,
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            bgcolor: 'primary.dark',
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              bgcolor: 'primary.dark',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
