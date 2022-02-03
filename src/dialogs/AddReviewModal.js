import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@material-ui/styles';
import { Divider, Rating } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { toast } from 'react-toastify';
import { AuthContext } from 'contexts/AuthContext';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+'
};
const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center'
  }
});

const AddReviewModal = ({ isOpen, closeDialog, addReview }) => {
  const { user } = useContext(AuthContext);
  const classes = useStyles();

  const [value, setValue] = React.useState(3);
  const [hover, setHover] = React.useState(-1);
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    addReview(review, value);
  };

  const handleChange = (e) => {
    setReview(e.target.value);
  };

  return (
    <div>
      <Dialog
        className={classes.Dialog}
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Review"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={review}
            name="review"
            onChange={handleChange}
          />
          <Rating
            name="rating"
            value={value}
            precision={0.5}
            onChange={(event, newValue) => {
              if (newValue === 0.5) newValue = 1;
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
          />
          {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Review
          </Button>
          <Button onClick={closeDialog} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddReviewModal;
