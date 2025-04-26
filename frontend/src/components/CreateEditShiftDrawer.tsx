// ShiftDrawer.tsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Shift, ShiftDate, ShiftType } from '../types/shifts';
import { clearCurrentShift } from '../store/features/shifts/shiftSlice';
import { updateShiftAsync, createShiftAsync, deleteShiftAsync } from '../store/features/shifts/shiftAction';

interface ShiftDrawerProps {
  open: string | null;
  onClose: () => void;
}

const ShiftDrawer: React.FC<ShiftDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentShift } = useSelector((state: RootState) => state.shifts);

  const [localShift, setLocalShift] = useState<Shift>({
    title: '',
    description: '',
    dates: [],
  });

  useEffect(() => {
    if (currentShift) {
      setLocalShift(currentShift);
    } else {
      setLocalShift({
        title: '',
        description: '',
        dates: [],
      });
    }
  }, [currentShift, open]);

  const handleClose = () => {
    dispatch(clearCurrentShift());
    onClose();
  };

  const handleSave = () => {
    if (currentShift?.id) {
      dispatch(updateShiftAsync({id:currentShift.id, shift: localShift}));
    } else {
      dispatch(createShiftAsync(localShift));
    }
    handleClose();
  };

  const handleDelete = () => {
    if (currentShift?.id) {
      dispatch(deleteShiftAsync(currentShift.id));
    }
    handleClose();
  };

const handleAddDate = () => {
  setLocalShift({
    ...localShift,
    dates: [
      ...localShift.dates,
      {
        date: '',
        startTime: '',
        endTime: '',
        price: 0,
        type: ShiftType.CONSULTATION
      },
    ],
  });
};

const handleDateChange = (index: number, field: keyof ShiftDate, value: any) => {
  const updatedDates = [...localShift.dates];

  let updatedValue = value;

  if (field === 'date') {
    const [year, month, day] = value.split('-');
    updatedValue = `${day}-${month}-${year}`;
  }

  updatedDates[index] = {
    ...updatedDates[index],
    [field]: updatedValue,
  };

  setLocalShift({
    ...localShift,
    dates: updatedDates,
  });
};


  const handleRemoveDate = (index: number) => {
    const updatedDates = [...localShift.dates];
    updatedDates.splice(index, 1);
    setLocalShift({
      ...localShift,
      dates: updatedDates,
    });
  };

  return (
    <Drawer anchor="right" open={!!open} onClose={handleClose}>
      <Box width={400} p={3}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">{open === 'create' ? 'Create': 'Edit'} Shift</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>

        <TextField
          label="Title"
          value={localShift.title}
          onChange={(e) => setLocalShift({ ...localShift, title: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Description"
          value={localShift.description}
          onChange={(e) => setLocalShift({ ...localShift, description: e.target.value })}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Dates</Typography>

        {localShift.dates.map((dateItem, index) => (
          <Box key={index} p={2} my={2} border={1} borderColor="grey.300" borderRadius={2}>
            <Grid container spacing={2}>
              <Grid>
                <TextField
                  label="Date"
                  type="date"                  
                 value={dateItem.date}
                  onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid >
                <TextField
                  label="Start Time"
                  type="time"
                  value={dateItem.startTime}
                  onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid >
                <TextField
                  label="End Time"
                  type="time"
                  value={dateItem.endTime}
                  onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid >
                <TextField
                  label="Price (€)"
                  type="number"
                  value={dateItem.price}
                  onChange={(e) => handleDateChange(index, 'price', parseFloat(e.target.value))}
                  fullWidth
                />
              </Grid>

              <Grid >
                <TextField
                  label="Type"
                  select
                  value={dateItem.type}
                  onChange={(e) => handleDateChange(index, 'type', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="telephone">Telephone</MenuItem>
                  <MenuItem value="ambulance">Ambulance</MenuItem>
                </TextField>
              </Grid>

              <Grid textAlign="right">
                <IconButton color="error" onClick={() => handleRemoveDate(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button fullWidth variant="outlined" color="primary" onClick={handleAddDate}>
          Add Date
        </Button>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between">
          {currentShift?.id && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ShiftDrawer;
