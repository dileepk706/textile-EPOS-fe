import { Container, ContainerProps } from '@mui/material';
import { ReactNode } from 'react';
import { formatCamelCase } from '@utils/format-text';
import CustomBreadcrumbs from '../custom-breadcrumbs';
import { useSettingsContext } from '../settings';

interface PageHeaderWithBreadcrumbsProps extends ContainerProps {
  heading: string;
  links?: {
    name: string;
    href?: string;
  }[];
  action?: ReactNode;
  stretch?: boolean;
  children: ReactNode;
  breadcrumbs: boolean;
}

export default function ContainerWithBreadcrumbs({
  heading,
  links,
  action,
  stretch = false,
  sx,
  breadcrumbs,
  children,
  ...other
}: PageHeaderWithBreadcrumbsProps) {
  const settings = useSettingsContext();

  if (!breadcrumbs) {
    return <Container maxWidth={settings.themeStretch ? false : 'lg'}>{children}</Container>;
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={formatCamelCase(heading)}
        links={links || [{ name: '', href: '' }]}
        action={action}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {children}
    </Container>
  );
}
