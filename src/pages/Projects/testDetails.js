import {
  Button,
  Card,
  Container,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Box, typography } from '@mui/system';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import SearchNotFound from 'src/components/SearchNotFound';
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from 'src/components/_dashboard/user';
import { AuthContext } from 'src/Contexts/AuthContext';
import { ProjectsContext } from 'src/Contexts/ProjectsContext';
import ConfirmDelete from 'src/dialogs/ConfirmDialogBox';
import { useToggleInput } from 'src/hooks';
import { handleCatch, makeReq } from 'src/utils/makeReq';
import v4 from 'uuid/dist/v4';
import ManageScanerio from './AddScanerios';

const TABLE_HEAD = [
  { _id: 'action', label: 'Action', alignRight: false },
  { _id: 'inputs', label: 'Inputs', alignRight: false },
  {
    _id: 'expectedOutput',
    label: 'ExpectedOutput',
    alignRight: false,
  },
  { _id: 'actualOutput', label: 'ActualOutput', alignRight: false },
  { _id: 'testResults', label: 'TestResults', alignRight: false },
  { _id: 'testComments', label: 'TestComments', alignRight: false },

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

const TestDetails = () => {
  const { getProjectById, projects, loading } =
    useContext(ProjectsContext);
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState();
  const [test, setTest] = useState();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddOpen, toggleAddScanerios] = useToggleInput(false);
  const [isDeleteOpen, toggleDelOpen] = useToggleInput(false);
  const [isEditOpen, toggleEditOpen] = useToggleInput(false);

  const { id, testId } = useParams();
  const navigate = useNavigate();

  const handleTxtChange = (e) => {
    setTest((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const data = getProjectById(id);
    if (!data) return navigate(`/dashboard/projects`);

    console.log('testId', testId);
    setProject(data);
    let newTest = data.tests?.find(
      (el) => el._id === testId.toString()
    );

    if (!newTest) return navigate(`/dashboard/projects/${id}`);

    setTest(newTest);
  }, [id, loading, projects]);

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = project?.tests?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (project?.tests?.length || 0)
        )
      : 0;

  const filteredData = applySortFilter(
    project?.tests || [],
    getComparator(order, orderBy),
    filterName
  );

  const handleSave = async () => {
    try {
      const resData = await makeReq(
        `/projects/test/${testId}`,
        { body: { ...test } },
        'PATCH'
      );
      console.log('resData', resData);
      setTest(resData.test);
      toast.success('Test Updated Successfully!');
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };

  const isUserNotFound = filteredData.length === 0;

  const handleAddScanerio = async (newState) => {
    try {
      toggleAddScanerios();
      const resData = await makeReq(
        `/projects/tests/${testId}/scenario`,
        { body: { ...newState } },
        'POST'
      );
      console.log('resData', resData);
      setTest((st) => ({
        ...st,
        scenarios: [...st.scenarios, resData.scenario],
      }));
      toast.success('Scanerios Added Successfully!');
    } catch (err) {
      handleCatch(err);
    } finally {
    }
    console.log('newState', newState);
  };
  const handleUpdateScanerio = async (newState) => {
    try {
      toggleEditOpen();
      const resData = await makeReq(
        `/projects/scenario/${selected?._id}`,
        { body: { ...newState } },
        'PATCH'
      );
      toast.success('Scanerios Updated Successfully!');

      setTest((st) => ({
        ...st,
        scenarios: st.scenarios.map((el) =>
          el._id === resData.scenario._id ? resData.scenario : el
        ),
      }));
    } catch (err) {
      handleCatch(err);
    } finally {
    }
    console.log('newState', newState);
  };
  const handleDeleteScanerio = async (newState) => {
    try {
      toggleDelOpen();
      const resData = await makeReq(
        `/projects/scenario/${selected}`,
        {},
        'DELETE'
      );
      toast.success('Scanerios Deleted Successfully!');

      setTest((st) => ({
        ...st,
        scenarios: st.scenarios.filter((el) => el._id !== selected),
      }));
      setSelected(null);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
    console.log('newState', newState);
  };

  if (!project) return <></>;
  if (!test) return <></>;

  return (
    <Page title={`Project | ${project.name}`}>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Test Name : {test.name}
          </Typography>
        </Stack>

        <Box
          mb={2}
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            variant='outlined'
            name='name'
            value={test.name}
            onChange={handleTxtChange}
            label='Name'
          />
          <TextField
            variant='outlined'
            name='language'
            value={test.language}
            onChange={handleTxtChange}
            label='Language'
          />
          <TextField
            variant='outlined'
            name='preRequiste'
            value={test.preRequiste}
            onChange={handleTxtChange}
            label='PreRequiste'
          />
        </Box>
        <Box
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            variant='outlined'
            name='priority'
            value={test.priority}
            onChange={handleTxtChange}
            label='Priority'
          />
          <TextField
            variant='outlined'
            name='difficultyLevel'
            value={test.difficultyLevel}
            onChange={handleTxtChange}
            label='Difficulty Level'
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleSave}
            style={{ width: '7rem' }}
          >
            Save
          </Button>
        </Box>

        <Typography variant='h5'>Scanerios</Typography>
        <Card>
          <Button
            variant='contained'
            onClick={toggleAddScanerios}
            style={{ float: 'right' }}
            startIcon={<Icon icon={plusFill} />}
            m={2}
          >
            Add New Scenario
          </Button>

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
                  rowCount={project?.tests?.length || 0}
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
                              {Array(6)
                                .fill()
                                .map(() => (
                                  <TableCell key={v4()} align='right'>
                                    <Skeleton />
                                  </TableCell>
                                ))}
                            </TableRow>
                          );
                        })
                    : test.scenarios
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            _id,
                            action,
                            inputs,
                            expectedOutput,
                            actualOutput,
                            testResults,
                            testComments,
                          } = row;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role='checkbox'
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
                                    {action}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align='left'>
                                {inputs}
                              </TableCell>
                              <TableCell align='left'>
                                {expectedOutput}
                              </TableCell>
                              <TableCell align='left'>
                                {actualOutput}
                              </TableCell>
                              <TableCell align='left'>
                                {testResults}
                              </TableCell>
                              <TableCell align='left'>
                                {testComments}
                              </TableCell>
                              {user && user.role === 'admin' && (
                                <TableCell align='right'>
                                  <UserMoreMenu
                                    currentProject={row}
                                    viewTask
                                    viewLink={`/dashboard/projects/${id}/tests/${_id}`}
                                    toggleDelOpen={toggleDelOpen}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
                                    user={user}
                                    isProject
                                    isScanerio
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
          <ManageScanerio
            open={isAddOpen}
            toggleDialog={toggleAddScanerios}
            onSuccess={handleAddScanerio}
          />
          <ManageScanerio
            open={isEditOpen}
            toggleDialog={toggleEditOpen}
            onSuccess={handleUpdateScanerio}
            update
            scenario={selected}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={project?.tests?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <ConfirmDelete
            open={isDeleteOpen}
            toggleDialog={toggleDelOpen}
            dialogTitle='Delete Test Scanerio ? '
            success={handleDeleteScanerio}
          />
        </Card>
      </Container>{' '}
    </Page>
  );
};

export default TestDetails;
