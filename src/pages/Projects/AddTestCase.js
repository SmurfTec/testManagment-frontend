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
              fullWidth
              onChange={handleTxtChange}
              label='Name'
            />
            <TextField
              variant='outlined'
              name='language'
              fullWidth
              value={state.language}
              onChange={handleTxtChange}
              label='Language'
            />
            <TextField
              variant='outlined'
              name='preRequiste'
              fullWidth
              value={state.preRequiste}
              onChange={handleTxtChange}
              label='PreRequiste'
            />

            <FormControl style={{ width: 250 }}>
              <InputLabel id='Priority'>Priority</InputLabel>
              <Select
                labelId='Priority'
                id='Priority-id'
                value={state.priority}
                label='Priority'
                name='priority'
                type='text'
                onChange={handleTxtChange}
              >
                <MenuItem value={'high'}>High</MenuItem>
                <MenuItem value={'medium'}>Medium</MenuItem>
                <MenuItem value={'low'}>Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl style={{ width: 250 }}>
              <InputLabel id='DifficultyLevel'>
                difficultyLevel
              </InputLabel>
              <Select
                labelId='DifficultyLevel'
                id='DifficultyLevel-id'
                value={state.difficultyLevel}
                label='Difficulty Level'
                name='difficultyLevel'
                type='number'
                onChange={handleTxtChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
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
          Create
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

export default AddTestCase;
