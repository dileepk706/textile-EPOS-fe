import Box from '@mui/material/Box';
import { useBoolean } from 'shared/hooks/useBoolean';
import { useResponsive } from 'shared/hooks/useResponsive';
import { useSettingsContext } from 'shared/ui/settings';
import NavVertical from './NavVertical';
import NavMini from './NavMini';
import AppMain from './app.main';
import Header from './Header';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  let sidebar;
  if (isMini) {
    sidebar = lgUp ? renderNavMini : renderNavVertical;
  } else {
    sidebar = renderNavVertical;
  }

  return (
    <>
      {!lgUp && <Header onOpenNav={nav.onTrue} />}

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {sidebar}

        <AppMain>{children}</AppMain>
      </Box>
    </>
  );
}
