import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// import DateTimePicker from 'react-datetime-picker';
import { makeStyles } from '@mui/styles';

import { toast } from 'react-toastify';
// import { AuthContext } from 'src/contexts/AuthContext';

const useStyles = makeStyles((props) => ({
  Dialog: {
    '& .MuiDialog-paper': {},
  },
  addBtn: {},
  cancelBtn: {},
}));

const AddorEditModal = (props) => {
  // const { user, loading } = useContext(AuthContext);

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
  };

  const [state, setState] = useState(initialState);

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
    console.log(e.target.name);
    console.log(e.target.value);

    setState((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    console.log('asdasd');
    if (!state.name) {
      toast.error('Plz fill in all fields before creating task');
      return;
    }
    if (isEdit) {
      // updateUser();
    } else {
    }
    createNew({ name: state.name });
    setState(initialState);
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            {isEdit === true ? 'Update' : 'Create'}
          </Button>
          <Button onClick={handleClose} variant='contained' color='error'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddorEditModal;
