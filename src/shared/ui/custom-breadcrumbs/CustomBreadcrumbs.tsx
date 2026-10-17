// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
//
import { isMobile } from 'shared/hooks/useResponsive';
import { CustomBreadcrumbsProps } from './types';
import LinkItem from './LinkItem';

// ----------------------------------------------------------------------

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1].name;
  const mobile = isMobile();
  return (
    <Box sx={{ ...sx }}>
      <Stack direction="row" alignItems={{ md: 'center', xs: 'start' }}>
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (
            <Typography variant={mobile ? 'h6' : 'h4'} gutterBottom>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {mobile
            ? lastLink && (
                <Breadcrumbs separator={<Separator />} {...other}>
                  <LinkItem key={lastLink} link={{ name: lastLink }} disabled />
                </Breadcrumbs>
              )
            : !!links.length && (
                <Breadcrumbs separator={<Separator />} {...other}>
                  {links.map((link) => (
                    <LinkItem
                      key={link.name || ''}
                      link={link}
                      activeLast={activeLast}
                      disabled={link.name === lastLink}
                    />
                  ))}
                </Breadcrumbs>
              )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
    />
  );
}
