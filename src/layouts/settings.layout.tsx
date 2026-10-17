import { useSettingsContext } from 'shared/ui/settings';
import { Container } from '@mui/material';
import { pathKeys } from 'shared/routes';
import PageTabsHeader from 'shared/ui/page-header/PageTabsHeader';

const SETTINGS_TABS = [
  {
    label: 'Gym',
    path: pathKeys.settings.gym,
  },
  {
    label: 'User',
    path: pathKeys.settings.user,
  },
];

type Props = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <PageTabsHeader title="Settings" tabs={SETTINGS_TABS} />
      {children}
    </Container>
  );
}
