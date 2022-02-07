import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@material-ui/styles';

import { toast } from 'react-toastify';

const useStyles = makeStyles((props) => ({
  Dialog: {
    '& .MuiDialog-paper': {
      minHeight: 250,
    },
  },
  addBtn: {},
  cancelBtn: {},
}));

const UserModal = (props) => {
  const {
    isOpen,
    closeDialog,
    createNew,
    role,
    isEdit,
    editUser,
    updateUser,
    viewOnly,
  } = props;

  const classes = useStyles();

  const initialState = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: '',
  };

  const [state, setState] = useState(initialState);

  console.log('STATE', state);

  useEffect(() => {
    // TODO
    if (isEdit === true && editUser) {
      setState({
        name: editUser.name,
      });
    } else {
      setState(initialState);
    }
  }, [editUser, isEdit]);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (!state.name) {
      toast.error('Plz fill in all fields before creating task');
      return;
    }
    if (isEdit) {
      // updateUser();
    } else {
    }
    createNew({
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirm: state.passwordConfirm,
      role: state.role,
    });

    e.preventDefault();
  };

  const handleClose = () => {
    setState(initialState);
    closeDialog();
  };

  return (
    <div>
      <Dialog
        className={classes.Dialog}
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {isEdit ? `Edit Project` : `Add New `}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Name'
            type='text'
            fullWidth
            value={state.name}
            name='name'
            onChange={handleChange}
            disabled={viewOnly}
          />
          <TextField
            autoFocus
            margin='dense'
            id='email'
            label='Email'
            type='text'
            fullWidth
            value={state.email}
            name='email'
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin='dense'
            id='password'
            label='Password'
            type='password'
            fullWidth
            value={state.password}
            name='password'
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin='dense'
            id='passwordConfirm'
            label='PasswordConfirm'
            type='password'
            fullWidth
            value={state.passwordConfirm}
            name='passwordConfirm'
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin='dense'
            id='role'
            label='Role'
            type='role'
            fullWidth
            value={state.role}
            name='role'
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant='contained'
            color='primary'
          >
            {isEdit === true ? 'Update' : 'Create'}
          </Button>
          <Button
            onClick={handleClose}
            variant='contained'
            color='error'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserModal;
