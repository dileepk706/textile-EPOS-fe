import { Link as MuiLink, LinkProps, Typography, TypographyProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type Props = TypographyProps & {
  href: string;
  children: React.ReactNode;
  underline?: 'none' | 'hover' | 'always';
  Color?: string;
  minWidth?: any;
  maxWidth?: any;
};

function CustomLink({
  href,
  children,
  Color: color = 'darkslateblue',
  underline,
  maxWidth,
  minWidth,
  ...other
}: Props) {
  return (
    <MuiLink component={RouterLink} to={href || '#'} underline={underline || 'hover'}>
      {/* {input} */}
      <Typography
        // sx={{ color: color === 'default' ? 'text.primary' : color || 'darkslateblue' }}
        color="primary.main"
        minWidth={minWidth}
        maxWidth={maxWidth}
        whiteSpace="wrap"
        variant="body2"
        {...other}
      >
        {children}
      </Typography>
    </MuiLink>
  );
}
// sx={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
export default CustomLink;

export function CustomLinkWithoutHref({
  input,
  Color,
  underline,
  ...other
}: LinkProps & {
  input: React.ReactNode;
  Color?: string;
  underline?: 'none' | 'hover' | 'always';
}) {
  return (
    <MuiLink sx={{ color: Color || 'darkslateblue' }} underline={underline || 'hover'} {...other}>
      {input}
    </MuiLink>
  );
}
