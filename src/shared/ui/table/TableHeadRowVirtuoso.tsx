// @mui
import { Theme, SxProps } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { memo } from 'react';

// ----------------------------------------------------------------------

type Props = {
  headLabel: any[];
  sx?: SxProps<Theme>;
};

function TableHeadRowVirtuoso({ headLabel, sx }: Props) {
  return (
    <TableRow>
      {headLabel.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align || 'left'}
          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
        >
          <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  );
}

export default memo(TableHeadRowVirtuoso);
