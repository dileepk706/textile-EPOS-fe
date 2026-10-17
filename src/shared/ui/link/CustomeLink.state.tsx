import { Link as MuiLink, LinkProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type Props = LinkProps & {
  href: string;
  input: React.ReactNode;
  underline?: 'none' | 'hover' | 'always';
  Color?: string;
};

function CustomLinkState({ input, Color: color = 'darkslateblue', underline, ...other }: any) {
  return (
    <MuiLink sx={{ color }} underline={underline || 'hover'} {...other}>
      {input}
    </MuiLink>
  );
}

export default CustomLinkState;
