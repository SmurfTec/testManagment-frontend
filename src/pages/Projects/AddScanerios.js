import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { handleCatch, makeReq } from 'src/utils/makeReq';

const ManageScanerio = ({
  open,
  toggleDialog,
  onSuccess,
  scenario,
  update = false,
}) => {
  const initialState = {
    action: '',
    inputs: '',
    expectedOutput: '',
    actualOutput: '',
    testResults: '',
    testComments: '',
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!update || !scenario || !scenario.action)
      return setState(initialState);

    console.log('scenario', scenario);
    setState(scenario);
  }, [scenario, update]);

  const handleTxtChange = (e) => {
    setState((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('state', state);
    onSuccess(state);
  };

  return (
    <Dialog open={open} onClose={toggleDialog}>
      <DialogTitle>
        {update ? 'Update' : 'Create'} Scanerio
      </DialogTitle>
      <DialogContent>
        <form id='form' onSubmit={handleSubmit}>
          <Box
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              padding: '1rem',
            }}
          >
            <TextField
              variant='outlined'
              fullWidth
              name='action'
              value={state.action}
              onChange={handleTxtChange}
              label='Action'
              required
            />
            <TextField
              variant='outlined'
              name='inputs'
              fullWidth
              value={state.inputs}
              onChange={handleTxtChange}
              label='Inputs'
              required
            />
            <TextField
              variant='outlined'
              name='expectedOutput'
              fullWidth
              value={state.expectedOutput}
              onChange={handleTxtChange}
              label='ExpectedOutput'
              required
            />
            <TextField
              variant='outlined'
              name='actualOutput'
              fullWidth
              value={state.actualOutput}
              onChange={handleTxtChange}
              label='ActualOutput'
              required
            />
            <TextField
              variant='outlined'
              name='testResults'
              fullWidth
              value={state.testResults}
              onChange={handleTxtChange}
              label='TestResults'
              required
            />
            <TextField
              variant='outlined'
              name='testComments'
              fullWidth
              value={state.testComments}
              onChange={handleTxtChange}
              label='TestComments'
              required
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='primary'
          form='form'
          type='submit'
        >
          {update ? 'Update' : 'Create'}
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={toggleDialog}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageScanerio;
