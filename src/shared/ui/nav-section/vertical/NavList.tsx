import { useState, useEffect, useCallback } from 'react';
// @mui
import Collapse from '@mui/material/Collapse';
// routes
import { usePathname } from '@routes/hook';
import { useActiveLink } from '@routes/hook/use-active-link';
//
import { NavListProps, NavConfigProps } from '../types';
import NavItem from './NavItem';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  depth: number;
  hasChild: boolean;
  config: NavConfigProps;
};

export default function NavList({ data, depth, hasChild, config }: NavListRootProps) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, hasChild);

  // const externalLink = data.path.includes('http');

  // const [open, setOpen] = useState(active);
  const [open, setOpen] = useState(true);

  // useEffect(() => {
  //   if (!active) {
  //     // handleClose();
  //   }
  // }, [pathname]);

  // const handleToggle = useCallback(() => {
  //   setOpen((prev) => !prev);
  // }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        // open={open}
        // onClick={handleToggle}
        open
        active={active}
        // externalLink={externalLink}
        config={config}
        sx={{ pl: 3 }}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} config={config} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[];
  depth: number;
  config: NavConfigProps;
};

function NavSubList({ data, depth, config }: NavListSubProps) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </>
  );
}
