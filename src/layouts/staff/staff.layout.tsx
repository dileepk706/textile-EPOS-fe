import { useSettingsContext } from 'shared/ui/settings';
import { Container } from '@mui/material';
import { pathKeys } from 'shared/routes';
import PageTabsHeader from 'shared/ui/page-header/PageTabsHeader';

const STAFF_TABS = [
  {
    label: 'Staffs',
    path: pathKeys.staff.root,
  },
  {
    label: 'Roles',
    path: pathKeys.staff.RRoles,
  },
];

type Props = {
  children: React.ReactNode;
};

export default function StaffLayout({ children }: Props) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <PageTabsHeader title="Staff" tabs={STAFF_TABS} />
      {children}
    </Container>
  );
}

// list
// create
// update
// roles - coming soon
// payrolls - coming soon
