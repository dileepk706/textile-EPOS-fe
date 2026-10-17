import { useSettingsContext } from 'shared/ui/settings';
import { Container } from '@mui/material';
import { pathKeys } from 'shared/routes';
import PageTabsHeader from 'shared/ui/page-header/PageTabsHeader';

const ACCOUNT_TABS = [
  {
    label: 'Settings',
    path: pathKeys.account(true).setting,
  },
  {
    label: 'Account Plan',
    path: pathKeys.account(true).plan,
  },
];

type Props = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <PageTabsHeader title="Account" tabs={ACCOUNT_TABS} />
      {children}
    </Container>
  );
}
