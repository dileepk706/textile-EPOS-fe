import { formatCamelCase } from '@utils/format-text';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { AccountSettingsWidget } from 'widgets/account-settings';

export default function SettingPage() {
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <CustomBreadcrumbs
        heading={formatCamelCase('Dashboard')}
        links={[{ name: 'Dashboard', href: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {/* <AccountSettingsWidget /> */}
    </>
  );
}
