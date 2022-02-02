import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Skeleton,
} from '@mui/material';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import {
  UserListHead,
  UserListToolbar,
} from '../../components/_dashboard/user';
//
import GameMoreMenu from 'src/components/_dashboard/game/GameMoreMenu';
import { DevRequestsContext } from 'src/Contexts/DevRequestsContext';
import v4 from 'uuid/dist/v4';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { _id: v4(), name: 'budget', label: 'budget', alignRight: false },
  { _id: v4(), user: 'user', label: 'user', alignRight: false },
  { _id: v4(), game: 'game', label: 'game', alignRight: false },
  {
    _id: v4(),
    description: 'description',
    label: 'description',
    alignRight: false,
  },
  { _id: v4(), status: 'status', label: 'status', alignRight: false },
  { _id: v4() },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array = [], comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Games() {
  const navigate = useNavigate();
  const { devRequests, loading, changeDevRequestStatus } =
    useContext(DevRequestsContext);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = (_id) => {
    // console.log(`_id`, _id);
    changeDevRequestStatus(_id, 'rejected');
  };
  const handleApprove = (_id) => {
    // console.log(`_id`, _id);
    changeDevRequestStatus(_id, 'approved');
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = devRequests?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const getColor = (status) => {
    return status === 'rejected'
      ? 'error'
      : status === 'approved'
      ? 'primary'
      : 'warning';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (devRequests?.length || 0))
      : 0;

  const filteredDevRequests = applySortFilter(
    devRequests,
    getComparator(order, orderBy),
    filterName
  );

  const isGameNotFound = filteredDevRequests.length === 0;

  return (
    <Page title='Development Requests'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Game
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug='Development Requests'
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={devRequests?.length || 0}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  noCheckBox
                />
                <TableBody>
                  {loading
                    ? Array(5)
                        .fill()
                        .map(() => {
                          return (
                            <TableRow
                              hover
                              key={v4()}
                              tabIndex={-1}
                              role='checkbox'
                              sx={{ cursor: 'pointer', textDecoration: 'none' }}
                            >
                              {Array(9)
                                .fill()
                                .map(() => (
                                  <TableCell key={v4()} align='right'>
                                    <Skeleton />
                                  </TableCell>
                                ))}
                            </TableRow>
                          );
                        })
                    : filteredDevRequests
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            _id,
                            user,
                            budget,
                            images,
                            description,
                            game,
                            status,
                          } = row;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role='checkbox'
                              sx={{ cursor: 'pointer', textDecoration: 'none' }}
                              onClick={() =>
                                navigate(
                                  `/dashboard/development-requests/${row._id}`
                                )
                              }
                            >
                              <TableCell padding='checkbox'></TableCell>
                              <TableCell
                                component='th'
                                scope='row'
                                padding='none'
                              >
                                <Stack
                                  direction='row'
                                  alignItems='center'
                                  spacing={2}
                                >
                                  <Avatar
                                    alt={'dev req img'}
                                    src={game.images?.[0]}
                                  />
                                  <Typography variant='subtitle2' noWrap>
                                    {budget}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align='left'>{user.name}</TableCell>
                              <TableCell align='left'>{game.name}</TableCell>
                              <TableCell align='left'>{description}</TableCell>
                              <TableCell align='left'>
                                <Label variant='ghost' color={getColor(status)}>
                                  {sentenceCase(status)}
                                </Label>
                              </TableCell>{' '}
                              {/**/}
                              {status === 'pending' && (
                                <TableCell align='right'>
                                  <GameMoreMenu
                                    game={row}
                                    handleDelete={(e) => {
                                      e.stopPropagation();
                                      handleDelete(row._id);
                                    }}
                                    handleApprove={(e) => {
                                      e.stopPropagation();
                                      handleApprove(row._id);
                                    }}
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isGameNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align='center' colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={devRequests?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
