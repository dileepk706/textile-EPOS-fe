import { ListItemText, TableCell, TableCellProps } from '@mui/material';
import { format } from 'date-fns';

type Props = TableCellProps & {
  date: number | Date;
};

function ShowDateOnTableRow({ date, ...others }: Props) {
  const fd = () => {
    try {
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.log('error while format date : ', error);
    }
  };
  const ft = () => {
    try {
      return format(date, 'p');
    } catch (error) {
      console.log('error while format date : ', error);
    }
  };

  if (!date) {
    return <TableCell {...others} />;
  }
  return (
    <TableCell {...others}>
      <ListItemText
        primary={fd()}
        secondary={ft()}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    </TableCell>
  );
}

export default ShowDateOnTableRow;
