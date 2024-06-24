'use client';

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
import { ChangeEvent, FC, useMemo, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchDoctors, SearchDoctorsApiResponse } from '@/app/lib/data/fetchDoctors';
import { LoadingButton } from '@mui/lab';

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
  const { searchResults, hasMoreToFetch } = data;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasMoreToLoad, setHasMoreToLoad] = useState(hasMoreToFetch);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [rows, setRows] = useState(searchResults);

  const visibleRows = useMemo(
    () =>
      rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ).toSorted((a, b) => b._score - a._score),
    [rows, page, rowsPerPage],
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLoadMoreClick = async () => {
    setIsLoadingData(true);

    const response = await fetchDoctors({
      firstName: searchedName.split(' ')[0],
      lastName: searchedName.split(' ')[1],
      skip: rows.length.toString(),
    });

    setIsLoadingData(false);
    if (response.status === 'failure') return;

    setRows((prevState) => [...prevState, ...response.data.searchResults]);
    setHasMoreToLoad(response.data.hasMoreToFetch);
  };

  return (
    <Paper className="w-full">
      <TableToolbar searchedName={searchedName}/>

      <TableContainer component={'div'}>
        <Table sx={{ minWidth: 650 }} aria-label="Doctors search table">
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">NPI</TableCell>
              <TableCell className="font-semibold">Doctor name</TableCell>
              <TableCell className="font-semibold">Phone number</TableCell>
              <TableCell className="font-semibold">Address</TableCell>
              <TableCell align="right" className="font-semibold">Specialty</TableCell>
              <TableCell align="right" className="font-semibold">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map(({ _source: row, _score }) => (
              <TableRow
                key={row.telephoneNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <a
                    href={`https://npiregistry.cms.hhs.gov/provider-view/${row.id}`}
                    target="_blank"
                    className="underline text-blue-400"
                  >
                    {row.id}
                  </a>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell>{row.telephoneNumber}</TableCell>
                <TableCell>
                  {row.address.street} <br/>
                  <span className="italic text-xs">{row.address.city}, {row.address.state}</span>
                </TableCell>
                <TableCell align="right">{row.specialty}</TableCell>
                <TableCell align="right">{_score.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex items-center pl-6">
        {hasMoreToLoad
          ? (<LoadingButton
            variant="outlined" size="small" loading={isLoadingData}
            onClick={handleLoadMoreClick}>Load more results</LoadingButton>)
          : null
        }
        <TablePagination
          className="flex-grow"
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Paper>
  );
};
