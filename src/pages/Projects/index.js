import { filter } from 'lodash';
import { useContext, useState } from 'react';
import faker from 'faker';
import { Icon } from '@iconify/react';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button,
  Skeleton,
} from '@mui/material';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from '../../components/_dashboard/user';
//
import { ProjectsContext } from 'src/Contexts/ProjectsContext';
import { AuthContext } from 'src/Contexts/AuthContext';
import v4 from 'uuid/dist/v4';
import plusFill from '@iconify/icons-eva/plus-fill';
import AddorEditModal from 'src/dialogs/AddorEditModal';
import ConfirmDelete from 'src/dialogs/ConfirmDialogBox';
import { useToggleInput } from 'src/hooks';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { _id: 'name', label: 'Name', alignRight: false },
  { _id: 'createdAt', label: 'CreatedAt', alignRight: false },
  { _id: 'tests', label: 'Tests', alignRight: false },
  { _id: '' },
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const { user, loading } = useContext(AuthContext);

  const {
    projects,
    deleteProject,
    createProject,
    loading: projectLoading,
  } = useContext(ProjectsContext);

  console.log('PROJECTS', projects);

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isCreateOpen, toggleCreateOpen] = useState(false);
  const [isDeleteOpen, toggleDelOpen] = useToggleInput(false);
  const [isEditOpen, toggleEditOpen] = useToggleInput(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = projects?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteProject = async (newState) => {
    toggleDelOpen();
    deleteProject(selected);
    setSelected(null);
    console.log('newState', newState);
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
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (projects?.length || 0)
        )
      : 0;

  const filteredData = applySortFilter(
    projects,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredData.length === 0;

  return (
    <Page title='Dashboard | Projects '>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Projects
          </Typography>
          {user && user.role !== 'tester' && (
            <Button
              variant='contained'
              onClick={toggleCreateOpen}
              startIcon={<Icon icon={plusFill} />}
            >
              New Project
            </Button>
          )}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected?.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug='Users'
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={projects?.length || 0}
                  numSelected={selected?.length}
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
                              sx={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                              }}
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
                    : filteredData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const { _id, name, createdAt } = row;
                          const isItemSelected =
                            selected?.indexOf(name) !== -1;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role='checkbox'
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
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
                                  <Typography
                                    variant='subtitle2'
                                    noWrap
                                  >
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align='left'>
                                {new Date(createdAt).toDateString()}
                              </TableCell>
                              <TableCell align='left'>
                                {row?.tests?.length}
                              </TableCell>
                              {user && user.role !== 'tester' && (
                                <TableCell align='right'>
                                  <UserMoreMenu
                                    currentProject={row}
                                    viewTask
                                    viewLink={`/dashboard/projects/${_id}`}
                                    toggleDelOpen={toggleDelOpen}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
                                    // addToTable={!manager}
                                    // toggleAddToOpen={() => {
                                    //   setSelectedTask(_id);
                                    //   toggleAddToOpen();
                                    // }}
                                    // handleRemoveFrom={() => {
                                    //   console.clear();
                                    //   console.log(`row`, row);
                                    //   console.log(`_id`, _id);
                                    //   console.log(
                                    //     `manager._id`,
                                    //     manager._id
                                    //   );
                                    //   const managerId =
                                    //     manager._id || manager;
                                    //   unAssignTaskFromManger(
                                    //     _id,
                                    //     managerId
                                    //   );
                                    // }}
                                  />
                                </TableCell>
                              )}
                              {user && user.role === 'tester' && (
                                <TableCell align='right'>
                                  <UserMoreMenu
                                    currentProject={row}
                                    viewTask
                                    viewLink={`/dashboard/projects/${_id}`}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
                                    // addToTable={!manager}
                                    // toggleAddToOpen={() => {
                                    //   setSelectedTask(_id);
                                    //   toggleAddToOpen();
                                    // }}
                                    // handleRemoveFrom={() => {
                                    //   console.clear();
                                    //   console.log(`row`, row);
                                    //   console.log(`_id`, _id);
                                    //   console.log(
                                    //     `manager._id`,
                                    //     manager._id
                                    //   );
                                    //   const managerId =
                                    //     manager._id || manager;
                                    //   unAssignTaskFromManger(
                                    //     _id,
                                    //     managerId
                                    //   );
                                    // }}
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
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        align='center'
                        colSpan={6}
                        sx={{ py: 3 }}
                      >
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
            count={projects?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <ConfirmDelete
        open={isDeleteOpen}
        toggleDialog={toggleDelOpen}
        dialogTitle='Delete Project ? '
        success={handleDeleteProject}
      />

      <AddorEditModal
        isOpen={isCreateOpen}
        createNew={(...props) => {
          console.log('adhas');
          createProject(...props, toggleCreateOpen);
        }}
        closeDialog={toggleCreateOpen}
      />
      {/* <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        // updateUser={(...props) => {
        //   editManager(...props, toggleEditOpen);
        // }}
        editUser={selected}
        isEdit
        role='Manager'
      /> */}
    </Page>
  );
}
