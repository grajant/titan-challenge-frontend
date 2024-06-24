import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip
} from '@mui/material';
import { SearchDoctorsApiResponse } from '@/app/lib/actions/searchDoctors';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';

type DoctorsTableProps = {
  searchedName: string;
  data: SearchDoctorsApiResponse
}

type TableToolbarProps = {
  searchedName: string;
};

const TableToolbar: FC<TableToolbarProps> = ({ searchedName }) => {
  return (
    <Toolbar
      className="px-4"
    >
      <h3 className="text-2xl font-semibold flex-[1_1_100%]">Results for {searchedName}</h3>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon/>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export const DoctorsTable: FC<DoctorsTableProps> = ({ data, searchedName }) => {
  const { searchResults: rows } = data;

  // const [order, setOrder] = useState<Order>('asc');
  // const [orderBy, setOrderBy] = useState<keyof Data>('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleRequestSort = (
  //   event: MouseEvent<unknown>,
  //   property: keyof Data,
  // ) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [page, rowsPerPage],
  );

  return (
    <Paper className="w-full">
      <TableToolbar searchedName={searchedName}/>

      <TableContainer component={'div'}>
        <Table sx={{ minWidth: 650 }} aria-label="Doctors search table">
          <TableHead>
            <TableRow>
              <TableCell>Doctor name</TableCell>
              <TableCell>Phone number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="right">Specialty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map(({ _source: row }) => (
              <TableRow
                key={row.telephoneNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell>{row.telephoneNumber}</TableCell>
                <TableCell>{row.address.street}</TableCell>
                <TableCell>{row.address.city}</TableCell>
                <TableCell>{row.address.state}</TableCell>
                <TableCell align="right">{row.specialty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
