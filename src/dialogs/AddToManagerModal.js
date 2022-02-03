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
import uuid from 'uuid/dist/v4';

import { DataContext } from 'contexts/DataContext';
import { AuthContext } from 'contexts/AuthContext';

import { withStyles } from '@material-ui/styles';
import Label from 'components/Label';
import { makeReq } from 'utils/constants';

const Styles = {
  Dialog: {
    '& .MuiDialog-paper': {
      maxWidth: 'unset',
      width: 800
    }
  }
};

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
  const [tableHeadings, setTableHeadings] = useState([
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'employees', label: 'Employees', alignRight: false },
    { id: 'groups', label: 'Groups', alignRight: false },
    { id: 'tasks', label: 'Tasks', alignRight: false }
  ]);

  const [filteredManagers, setFilteredManagers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (!data || data === null) return;

    if (!resource && resource !== 'managers') {
      setFilteredManagers(applySortFilter(data, getComparator(order, orderBy), filterName));
    } else {
      console.clear();
      console.log(`data`, data);
      try {
        (async () => {
          var managersWithRatings = await Promise.all(
            data.map(async (manager) => {
              let returnObj = [];

              var managerTasksRatings = await Promise.all(
                manager.tasks.map(async (task) => {
                  const resData = await makeReq(`/task/getTaskReviews/${task._id}`);
                  console.log(`resData`, resData);
                  if (resData.reviews.length > 0) {
                    const avgRating =
                      resData.reviews.reduce((prev, currentVal) => prev + currentVal.avgRating, 0) /
                      resData.reviews.length;

                    returnObj = [...returnObj, avgRating];

                    console.log(`avgRating`, avgRating);
                    return avgRating;
                  } else {
                    return 4.5; // * Task has no review , so avg rating = 4.5
                  }
                })
              );
              console.log(`managerTasksRatings`, managerTasksRatings);
              console.log(`returnObj`, returnObj);
              const managerRating =
                returnObj.reduce((prev, currentVal) => prev + currentVal, 0) / returnObj.length;

              console.log(`RETURNING manager ${manager.name} Rating`, managerRating);

              return { ...manager, rating: !!managerRating ? managerRating : 0 };
            })
          );

          console.log(`managersWithRatings`, managersWithRatings);
          setTableHeadings((st) => [...st, { id: 'ratings', label: 'Ratings', alignRight: false }]);
          setFilteredManagers(
            applySortFilter(managersWithRatings, getComparator(order, orderBy), filterName)
          );
        })();
      } catch (err) {
        console.log('ERR', err);
      }
    }
  }, [data]);

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

  const isUserNotFound = filteredManagers.length === 0;

  useEffect(() => {
    if (!data || data === null) return;
    setFilteredManagers(
      applySortFilter(filteredManagers, getComparator(order, orderBy), filterName)
    );
  }, [data, order, orderBy, filterName]);

  const isAlreadyHere = (target, array) => {
    const condition = !!array.find((el) => el._id === target);
    return slug === 'Add' ? condition : !condition;
  };

  return (
    <div>
      <Dialog
        className={classes.Dialog}
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Assign task to Manager</DialogTitle>
        <DialogContent>
          <Card>
            <UserListToolbar
              numSelected={0}
              filterName={filterName}
              onFilterName={handleFilterByName}
              slug={`${resource && resource === 'managers' ? 'Managers' : 'Groups'}`}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHeadings}
                    rowCount={data ? data.length : 0}
                    numSelected={0}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />

                  <TableBody>
                    {data
                      ? filteredManagers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const { _id, name, tasks, employees, groups } = row;

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
                                    // disabled={isAlreadyHere(targetId, row.employees)}
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
                                <TableCell align="left">
                                  {employees && employees.length > 0 ? (
                                    employees.length
                                  ) : (
                                    <Label variant="ghost" color="error">
                                      0
                                    </Label>
                                  )}
                                </TableCell>

                                <TableCell align="left">
                                  {groups && groups.length > 0 ? (
                                    groups.length
                                  ) : (
                                    <Label variant="ghost" color="error">
                                      0
                                    </Label>
                                  )}
                                </TableCell>

                                <TableCell align="left">
                                  {tasks && tasks.length > 0 ? (
                                    tasks.length
                                  ) : (
                                    <Label variant="ghost" color="error">
                                      0
                                    </Label>
                                  )}
                                </TableCell>
                                {resource && resource === 'managers' && (
                                  <TableCell align="left">
                                    {row.rating && row.rating > 0 ? (
                                      row.rating
                                    ) : (
                                      <Label variant="ghost" color="error">
                                        Not Rated
                                      </Label>
                                    )}
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })
                      : Array(5)
                          .fill()
                          .map(() => (
                            <TableRow key={uuid()}>
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
