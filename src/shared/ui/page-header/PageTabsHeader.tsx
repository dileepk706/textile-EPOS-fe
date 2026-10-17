import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { RouterLink } from '@routes/components';
import { Paper } from 'shared/ui/paper';
import { HEADER_MB } from '@layouts/configLayout';

export type HeaderTab = {
  label: string;
  path: string;
};

type PageTabsHeaderProps = {
  title: string;
  tabs: HeaderTab[];
  mb?: number;
};

const normalizePath = (path: string) => path.replace(/\/+$/, '');

export default function PageTabsHeader({ title, tabs, mb = HEADER_MB }: PageTabsHeaderProps) {
  const { pathname } = useLocation();

  const currentTab = useMemo(() => {
    const currentPath = normalizePath(pathname);

    const activeTab = tabs.find((tab) => currentPath === normalizePath(tab.path));

    return activeTab ? normalizePath(activeTab.path) : false;
  }, [pathname, tabs]);

  return (
    <Paper component="header" sx={{ mb }}>
      <Box
        sx={{
          px: { xs: 1.5, md: 2 },
          pt: { xs: 1.5, md: 1.5 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          {title}
        </Typography>

        <Tabs
          value={currentTab}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 32,
            '.MuiTabs-indicator': {
              height: 2,
              bgcolor: 'primary.main',
            },
            '.MuiTab-root': {
              minHeight: 32,
              px: { xs: 1.5, md: 2 },
              py: 0,
              color: 'text.primary',
              fontSize: 13,
              fontWeight: 400,
              textTransform: 'none',
              whiteSpace: 'nowrap',

              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 500,
              },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.path}
              label={tab.label}
              value={normalizePath(tab.path)}
              component={RouterLink}
              href={tab.path}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
}
