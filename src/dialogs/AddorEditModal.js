import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// import DateTimePicker from 'react-datetime-picker';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@material-ui/styles';

import { toast } from 'react-toastify';
// import { AuthContext } from 'src/contexts/AuthContext';

const useStyles = makeStyles((props) => ({
  Dialog: {
    '& .MuiDialog-paper': {
      minHeight: 250,
    },
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

export default AddorEditModal;
