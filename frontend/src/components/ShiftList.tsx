import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Slider, 
  Grid, 
  Button, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { 
  setPriceFilter
} from '../store/features/shifts/shiftSlice';
import { 
  selectFilteredShifts, 
  selectShiftsStatus, 
  selectPriceFilter 
} from '../store/features/shifts/shiftSelectors';
import ShiftCard from './ShiftCard';
import { fetchShiftsAsync } from '../store/features/shifts/shiftAction';
import { AppDispatch } from '../store';

interface ShiftListProps {
    setOpenDrawer: (type: string) => void;
  }

const ShiftList: React.FC<ShiftListProps> = ({setOpenDrawer}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const shifts = useSelector(selectFilteredShifts);
  const status = useSelector(selectShiftsStatus);
  const priceFilter = useSelector(selectPriceFilter);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchShiftsAsync());
    }
  }, [status, dispatch]);

  const handlePriceFilterChange = (_event: Event, newValue: number | number[]) => {
    dispatch(setPriceFilter(newValue as [number, number]));
  };

  const handleAddShift = () => {
    setOpenDrawer('create')
  };

  return (
    <Grid direction={'column'} container spacing={3}>
      <Grid columns={3}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ pb: 1, borderBottom: '1px solid #eee' }}>
            Filter
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Filter on price
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={priceFilter}
                onChange={handlePriceFilterChange}
                valueLabelDisplay="auto"
                min={0}
                max={200}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">€{priceFilter[0]}</Typography>
                <Typography variant="body2">€{priceFilter[1]}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      <Grid columns={9}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            Shifts
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddShift}
          >
            Add Shift
          </Button>
        </Box>
        
        {status === 'loading' && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
        
        {status === 'succeeded' && shifts.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No shifts found. Try adjusting your filters or add a new shift.
            </Typography>
          </Paper>
        )}
        
        {shifts.map(shift => (
          <ShiftCard key={shift.id} shift={shift} setOpenDrawer={setOpenDrawer} />
        ))}
      </Grid>
    </Grid>
  );
};

export default ShiftList;