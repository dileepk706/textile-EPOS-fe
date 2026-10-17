import { LinkProps } from '@mui/material';
import CustomLink from '../link/CustomeLink';

type Props = LinkProps & {
  url: string;
};
export default function ({ url, ...other }: Props) {
  return (
    <CustomLink href={url} {...other}>
      View all
    </CustomLink>
  );
}
