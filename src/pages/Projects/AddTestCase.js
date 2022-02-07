import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { handleCatch, makeReq } from 'src/utils/makeReq';

const AddTestCase = ({ open, toggleDialog, onSuccess }) => {
  const initialState = {
    name: '',
    language: '',
    preRequiste: '',
    priority: '',
    difficultyLevel: '',
  };

  const [state, setState] = useState(initialState);

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
      <DialogTitle>Create Test</DialogTitle>
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
              name='name'
              value={state.name}
              onChange={handleTxtChange}
              label='Name'
            />
            <TextField
              variant='outlined'
              name='language'
              value={state.language}
              onChange={handleTxtChange}
              label='Language'
            />
            <TextField
              variant='outlined'
              name='preRequiste'
              value={state.preRequiste}
              onChange={handleTxtChange}
              label='PreRequiste'
            />
            <FormControl style={{ width: 200 }}>
              <InputLabel id='Priority'>Priority</InputLabel>
              <Select
                labelId='Priority'
                id='Priority-id'
                value={state.priority}
                label='Priority'
                name='priority'
                onChange={handleTxtChange}
              >
                <MenuItem value={'high'}>High</MenuItem>
                <MenuItem value={'medium'}>Medium</MenuItem>
                <MenuItem value={'low'}>Low</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant='outlined'
              name='difficultyLevel'
              value={state.difficultyLevel}
              onChange={handleTxtChange}
              type='number'
              style={{ width: 200 }}
              inputProps={{ min: 1, max: 5 }}
              label='Difficulty Level'
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' form='form' type='submit'>
          Create
        </Button>
        <Button variant='contained' color='error' onClick={toggleDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTestCase;
