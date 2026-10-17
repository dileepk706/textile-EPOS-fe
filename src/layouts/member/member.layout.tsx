import { useSettingsContext } from 'shared/ui/settings';
import { Container } from '@mui/material';
import { pathKeys } from 'shared/routes';
import PageTabsHeader from 'shared/ui/page-header/PageTabsHeader';

const MEMBER_TABS = [
  {
    label: 'Members',
    path: pathKeys.members(true).root,
  },
  {
    label: 'Check-in',
    path: pathKeys.members(true).checkIn,
  },
  {
    label: 'Attendance',
    path: pathKeys.members(true).attendance,
  },
  {
    label: 'Membership',
    path: pathKeys.members(true).membership,
  },
];

type Props = {
  children: React.ReactNode;
};

export default function MemberLayout({ children }: Props) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <PageTabsHeader title="Memberships" tabs={MEMBER_TABS} />
      {children}
    </Container>
  );
}
