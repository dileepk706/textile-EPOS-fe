import { memo, useState, useCallback, useEffect } from 'react';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { Divider } from '@mui/material';
import { NavSectionProps, NavListProps, NavConfigProps } from '../types';
import { navVerticalConfig } from '../config';
import { StyledSubheader } from './styles';
import NavList from './NavList';

// ----------------------------------------------------------------------

function NavSectionVertical({ data, config, sx, ...other }: NavSectionProps) {
  const [modifiedData, setModifiedData] = useState(
    data.map((e) => ({ ...e, isOpen: true }))
  );
  useEffect(() => {
    setModifiedData(
      data.map((e) => ({ ...e, isOpen: true }))
    );
  }, [data]);

  const handleToggleOptionsValues = useCallback(
    (subheader: string, open: boolean) => {
      const newData = modifiedData.map((e) => e.subheader === subheader ? { ...e, isOpen: open } : { ...e, isOpen: false });
      setModifiedData(newData);
    },
    [data]
  );

  return (
    <Stack sx={sx} {...other}>
      {modifiedData.map((group, index) => (
        <Group
          key={group.subheader || index}
          subheader={group.subheader}
          items={group.items}
          config={navVerticalConfig(config)}
          isOpen={group.isOpen || false}
          handleToggleOptionsValues={handleToggleOptionsValues}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionVertical);


// ----------------------------------------------------------------------

type GroupProps = {
  subheader: string;
  items: NavListProps[];
  config: NavConfigProps;
  isOpen: boolean;
  handleToggleOptionsValues: (subheader: string, open: boolean) => void;
};

function Group({ subheader, items, config, isOpen, handleToggleOptionsValues }: GroupProps) {
  const handleToggle = useCallback(() => {
    handleToggleOptionsValues(subheader, !isOpen);
  }, [isOpen]);

  const renderContent = items.map((list) => (
    <NavList
      key={list.title + list.path}
      data={list}
      depth={1}
      hasChild={!!list.children}
      config={config}
    />
  ));

  return (
    <List disablePadding sx={{ px: 2,}}>
      {subheader ? (
        <>
          <StyledSubheader
            disableGutters
            disableSticky
            onClick={() => {
              // handleToggle()
            }}
            config={config}
          >
            {subheader}
          </StyledSubheader>

          <Collapse in={isOpen}>{renderContent}</Collapse>
          <Divider orientation="horizontal" sx={{my:1}} />
        </>
      ) : (
        renderContent
      )}
    </List>
  );
}
