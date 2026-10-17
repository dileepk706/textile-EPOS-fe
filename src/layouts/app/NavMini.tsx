import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { hideScroll } from '@theme/css';
import { NavSectionMini } from 'shared/ui/nav-section';
import { NAV } from '../configLayout';
import { useNavData } from './ConfigNavigation';
import NavToggleButton from '../_common/NavToggleButton';
import TextilesLabel from '../_common/TextileLabel';
import LogoutButton from '../_common/LogoutButton';

// ----------------------------------------------------------------------

export default function NavMini({ isBilling }: { isBilling?: boolean }) {
  const navData = useNavData(isBilling);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
        bgcolor: 'primary.dark',
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          bgcolor: 'primary.dark',
          ...hideScroll.x,
        }}
      >
        <Box sx={{ px: 1, py: 3, display: 'inline-flex', justifyContent: 'center' }}>
          <TextilesLabel mini />
        </Box>

        <NavSectionMini
          data={navData}
          config={{
            currentRole: 'admin',
          }}
          sx={{
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

        <LogoutButton mini />
      </Stack>
    </Box>
  );
}
