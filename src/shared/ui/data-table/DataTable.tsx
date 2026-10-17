import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { BGC } from '@layouts/configLayout';

// ----------------------------------------------------------------------

export type ColumnDef<TRow> = {
  id: string;
  label: string;
  minWidth?: number;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  /** Render a custom cell. Defaults to `row[id]` */
  render?: (row: TRow, index: number) => React.ReactNode;
};

interface DataTableProps<TRow extends { id: string }> {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  isLoading?: boolean;
  skeletonRows?: number;
  /** Enable row selection with checkboxes */
  selectable?: boolean;
  selected?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
  /** Sorting */
  order?: 'asc' | 'desc';
  orderBy?: string;
  onSort?: (column: string) => void;
  /** Empty state message */
  emptyText?: string;
  sx?: SxProps<Theme>;
}

/**
 * Generic, reusable data table with:
 * - sortable headers
 * - optional checkbox selection
 * - loading skeletons
 * - empty state
 */
export default function DataTable<TRow extends { id: string }>({
  columns,
  rows,
  isLoading = false,
  skeletonRows = 6,
  selectable = false,
  selected = [],
  onSelectRow,
  onSelectAll,
  order,
  orderBy,
  onSort,
  emptyText = 'No data found',
  sx,
}: DataTableProps<TRow>) {
  if (!rows) return;
  const allSelected = rows.length > 0 && selected.length === rows.length;
  const someSelected = selected.length > 0 && selected.length < rows.length;

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      // sx={{ borderRadius: 2, overflow: 'hidden', ...sx }}
    >
      <Table size="small">
        {/* ─── HEAD ─── */}
        <TableHead>
          <TableRow
            sx={
              {
                // bgcolor: '#e7e5e5',
                // '& th': {
                //   fontWeight: 600,
                //   fontSize: '0.75rem',
                //   letterSpacing: '0.05em',
                //   textTransform: 'uppercase',
                //   color: 'text.secondary',
                //   borderBottom: '1px solid',
                //   borderColor: 'divider',
                //   py: 1.5,
                // },
              }
            }
          >
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </TableCell>
            )}

            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align ?? 'left'}
                sx={{
                  minWidth: col.minWidth,
                  width: col.width,
                  backgroundColor: BGC,
                }}
              >
                {onSort ? (
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => onSort(col.id)}
                    hideSortIcon={false}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ─── BODY ─── */}
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, idx) => (
              <TableRow key={idx}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={18} height={18} />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                align="center"
                sx={{ py: 8, backgroundColor: BGC }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Box component="span" sx={{ fontSize: 40, opacity: 0.3, lineHeight: 1 }}>
                    🔍
                  </Box>
                  <Typography variant="body2" color="text.disabled">
                    {emptyText}
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            rows?.map((row, rowIdx) => {
              const isSelected = selected.includes(row.id);
              return (
                <TableRow
                  key={row.id}
                  hover={false}
                  selected={isSelected}
                  sx={{
                    bgcolor: BGC,
                    cursor: selectable ? 'pointer' : 'default',
                    '&:hover, &.Mui-selected:hover': {
                      bgcolor: `${BGC} !important`, // Forces your custom background to stay locked on hover
                    },
                    '& td': {
                      borderBottom: '1px solid',
                      borderColor: 'gray',
                      // py: 1.5,
                    },
                  }}
                  onClick={() => selectable && onSelectRow?.(row.id)}
                >
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => onSelectRow?.(row.id)}
                      />
                    </TableCell>
                  )}

                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align ?? 'left'}>
                      {col.render ? col.render(row, rowIdx) : String((row as any)[col.id] ?? '—')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
