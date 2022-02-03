import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DatePicker } from 'react-trip-date';

import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles({
  textField: {
    margin: '2rem'
  }
});

export default function MeetingScheduleDialog(props) {
  const theme = useTheme();
  const initialState = {
    startTime: '07:30',
    endTime: '09:30'
  };

  const { open, closeDialog, success, meeting, user } = props;
  const classes = useStyles();
  const [state, setstate] = useState(initialState);
  const [selectedMeetingDays, setSelectedMeetingDays] = useState();

  useEffect(() => {
    if (!meeting) setstate(initialState);
    else {
      let newState = {
        // startTime:
        //   meeting.startTime
        // ).getMinutes()}`,
        // endTime: `${new Date(meeting.endTime).getHours()}:${new Date(meeting.endTime).getMinutes()}`
        startTime: new Date(meeting.startTime).toTimeString().slice(0, 5),
        endTime: new Date(meeting.endTime).toTimeString().slice(0, 5)
      };

      setstate(newState);
      setSelectedMeetingDays(meeting.days.map((el) => el.date.slice(0, el.date.indexOf('T'))));
    }
  }, [meeting]);

  const handleTimeChange = (e) => {
    console.log(`e`, e);
    setstate((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  const handleDaysChange = (days) => {
    setSelectedMeetingDays(days);
  };

  const handleSubmit = () => {
    console.log(`state`, state);
    console.log(`selectedMeetingDays`, selectedMeetingDays);
    const [startHours, startMins] = state.startTime.split(':');
    const [endHours, endMins] = state.endTime.split(':');

    let startTime = new Date();
    startTime.setHours(startHours);
    startTime.setMinutes(startMins);

    let endTime = new Date();
    endTime.setHours(endHours);
    endTime.setMinutes(endMins);

    console.log(`startTime`, startTime);
    console.log(`endTime`, endTime);

    const newDays = selectedMeetingDays.map((el) => new Date(el));

    console.log(`newDays`, newDays);

    success({ startTime, endTime, days: newDays });
  };

  return (
    <Dialog
      onClose={closeDialog}
      aria-labelledby="simple-dialog-title"
      open={open}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title" className={classes.Title}>
        {meeting ? 'Create' : 'Update'} Meeting Schedule
      </DialogTitle>
      <DialogContent
        style={{
          overflow: 'scroll'
        }}
      >
        <TextField
          id="startTime"
          name="startTime"
          label="Start Time"
          type="time"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          // defaultValue="07:30"
          value={state.startTime}
          inputProps={{
            step: 300 // 5 min
          }}
          onChange={handleTimeChange}
        />
        <TextField
          id="endTime"
          name="endTime"
          label="End Time"
          type="time"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          // defaultValue="07:30"
          value={state.endTime}
          inputProps={{
            step: 300 // 5 min
          }}
          onChange={handleTimeChange}
        />
        <DatePicker
          theme={theme}
          onChange={handleDaysChange}
          jalali={false}
          numberOfMonths={1}
          selectedDays={selectedMeetingDays}
          numberOfSelectableDays={30} // number of days you need
          disabledBeforeToday
          // disabledAfterDate={new Date()}
          autoResponsive={false}
          disabled={false} // disable calendar
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {meeting ? 'Create' : 'Update'}
        </Button>
        <Button onClick={closeDialog} variant="contained" color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
