import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import { SearchBar } from 'shared/ui/search-bar';
import { StaffTable } from 'widgets/staff-table';
import { Paper } from 'shared/ui/paper';
import { FactoryButton } from 'shared/ui';
import { RouterLink } from '@routes/components';
import { pathKeys } from 'shared/routes';
import TableActionsWrapper from 'shared/ui/table/TableActionsWrapper';
import { searchUsersQueryOptions } from 'entities/user';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function StaffListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery(searchUsersQueryOptions({ query: searchQuery }));

  return (
    <>
      <Helmet>
        <title>Staff List</title>
      </Helmet>

      <CustomBreadcrumbs heading="Staff List" links={[{ name: 'Staffs', href: '' }]} />
      <Paper>
        <TableActionsWrapper>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search staff…"
            debounceMs={500}
            sx={{ width: '100%' }}
          />

          {/* <DateFilterDropdown label="Updated" value={dateFilter} onChange={setDateFilter} /> */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <FactoryButton component={RouterLink} to={pathKeys.staff.createFP}>
              Create s
            </FactoryButton>
          </Box>
        </TableActionsWrapper>
        <StaffTable rows={data as any} isLoading={isLoading} />
      </Paper>
    </>
  );
}
