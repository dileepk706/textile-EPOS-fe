import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { forwardRef } from 'react';

export default function ({ size }: any) {
  return {
    Scroller: forwardRef((props, ref: any) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props: any) => (
      <Table size={size || 'medium'} {...props} style={{ borderCollapse: 'separate' }} />
    ),
    TableHead,
    TableRow,
    TableBody: forwardRef((props, ref: any) => (
      <TableBody component={TableBody} {...props} ref={ref} />
    )),
  };
}
