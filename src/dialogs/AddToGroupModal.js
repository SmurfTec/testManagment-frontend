import React, { useState, useEffect, useContext } from 'react';
import { filter } from 'lodash';

// material
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Checkbox
} from '@material-ui/core';
// components
// import Skeleton from '@material-ui/lab/Skeleton';
import Skeleton from 'react-loading-skeleton';

import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
//

import { DataContext } from 'contexts/DataContext';
import { AuthContext } from 'contexts/AuthContext';

import { withStyles } from '@material-ui/styles';

const Styles = {
  Dialog: {
    '& .MuiDialog-paper': {
      maxWidth: 'unset',
      width: 800
    }
  }
};

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'manager', label: 'Manager', alignRight: false },
  { id: 'employees', label: 'Employees', alignRight: false },
  { id: 'tasks', label: 'Tasks', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const AddToTableModal = (props) => {
  const { isOpen, closeDialog, classes, targetId, data, addAction, slug, resource } = props;

  const [filteredGroups, setFilteredGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {}, [data]);

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleSubmit = (e) => {
    console.log('where');
    addAction(targetId, selected);
    setSelected(null);
    closeDialog();
    e.preventDefault();
  };

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const toggleDelOpen = () => setIsDelOpen((st) => !st);
  const toggleEditOpen = () => setIsEditOpen((st) => !st);
  const toggleCreateOpen = () => setIsCreateOpen((st) => !st);

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

  const emptyRows = page > 0 && data ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const isUserNotFound = filteredGroups.length === 0;

  useEffect(() => {
    if (!data || data === null) return;
    setFilteredGroups(applySortFilter(data, getComparator(order, orderBy), filterName));
  }, [data, order, orderBy, filterName]);

  const isAlreadyHere = (target, array) => {
    if (resource === 'Employee') {
      const condition = !!array.find((el) => el._id === target);
      return slug === 'Add' ? condition : !condition;
    }
    return false;
  };

  return (
    <div>
      <Dialog
        className={classes.Dialog}
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add {resource} to Group</DialogTitle>
        <DialogContent>
          <Card>
            <UserListToolbar
              numSelected={0}
              filterName={filterName}
              onFilterName={handleFilterByName}
              slug="Groups"
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={data ? data.length : 0}
                    numSelected={0}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />

                  <TableBody>
                    {data
                      ? filteredGroups
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const { _id, name, manager, tasks, employees } = row;

                            return (
                              <TableRow
                                hover
                                key={_id}
                                tabIndex={-1}
                                role="checkbox"
                                selected={false}
                                aria-checked={false}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selected === _id}
                                    onChange={() => setSelected(_id)}
                                    disabled={isAlreadyHere(targetId, row.employees)}
                                  />
                                </TableCell>
                                <TableCell component="th" scope="row" padding="none">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar
                                      alt={name}
                                      src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name
                                        .split(' ')
                                        .join('%20')}`}
                                    />
                                    <Typography variant="subtitle2" noWrap>
                                      {name}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell align="left">{manager && manager.name}</TableCell>
                                <TableCell align="left">
                                  {employees ? employees.length : 0}
                                </TableCell>
                                <TableCell align="left">{tasks ? tasks.length : 0}</TableCell>
                              </TableRow>
                            );
                          })
                      : Array(5)
                          .fill()
                          .map(() => (
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>
                                <Skeleton />
                              </TableCell>
                              <TableCell>
                                <Skeleton />
                              </TableCell>
                              <TableCell>
                                <Skeleton />
                              </TableCell>
                              <TableCell>
                                <Skeleton />
                              </TableCell>
                              <TableCell>
                                <Skeleton />
                              </TableCell>
                            </TableRow>
                          ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {data && isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
              component="div"
              count={data ? data.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {slug}
          </Button>
          <Button onClick={closeDialog} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withStyles(Styles)(AddToTableModal);
