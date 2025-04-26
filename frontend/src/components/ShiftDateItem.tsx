import React from 'react';
import {
  Typography,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  IconButton,
  InputAdornment,
  Grid,
  Paper
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ShiftDate, ShiftType } from '../types/shifts';

interface ShiftDateItemProps {
  date: ShiftDate;
  index: number;
  onUpdate: (index: number, updatedDate: ShiftDate) => void;
  onRemove: (index: number) => void;
}

const ShiftDateItem: React.FC<ShiftDateItemProps> = ({ 
  date, 
  index, 
  onUpdate, 
  onRemove 
}) => {
  const handleChange = (field: keyof ShiftDate, value: any) => {
    onUpdate(index, { ...date, [field]: value });
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        mb: 2, 
        position: 'relative',
        bgcolor: '#f9f9f9'
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {date.date}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onRemove(index)}
        sx={{ 
          position: 'absolute', 
          right: 8, 
          top: 8
        }}
      >
        <CloseIcon />
      </IconButton>
      
      <Grid container spacing={2}>
        <Grid columns={3}>
          <TextField
            label="Start Time"
            value={date.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>
        
        <Grid columns={3}>
          <TextField
            label="End Time"
            value={date.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>
        
        <Grid columns={3}>
          <TextField
            label="Price"
            value={date.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
          />
        </Grid>
        
        <Grid columns={3}>
          <FormControl fullWidth>
            <InputLabel id={`type-label-${index}`}>Type</InputLabel>
            <Select
              labelId={`type-label-${index}`}
              value={date.type}
              label="Type"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value={ShiftType.CONSULTATION}>Consultation</MenuItem>
              <MenuItem value={ShiftType.TELEPHONE}>Telephone</MenuItem>
              <MenuItem value={ShiftType.AMBULANCE}>Ambulance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ShiftDateItem;