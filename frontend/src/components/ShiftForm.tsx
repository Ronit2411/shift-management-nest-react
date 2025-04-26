  import React, { useState, useEffect } from 'react';
  import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
  } from '@mui/material';
  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
  import { format } from 'date-fns';
  import { Shift, ShiftDate, ShiftType } from '../types/shifts';
  import ShiftDateItem from './ShiftDateItem';

  interface ShiftFormProps {
    shift?: Shift;
    onSubmit: (shift: Shift) => void;
    onDelete?: () => void;
  }

  const emptyShift: Shift = {
    title: '',
    description: '',
    dates: []
  };

  const defaultShiftDate: ShiftDate = {
    date: format(new Date(), 'dd-MM-yyyy'),
    startTime: '09:00',
    endTime: '17:00',
    price: 0,
    type: ShiftType.CONSULTATION
  };

  const ShiftForm: React.FC<ShiftFormProps> = ({ shift, onSubmit, onDelete }) => {
    const [formData, setFormData] = useState<Shift>(shift || emptyShift);
    const [newDateDialogOpen, setNewDateDialogOpen] = useState(false);
    const [newDate, setNewDate] = useState<ShiftDate>({ ...defaultShiftDate });
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (shift) {
        setFormData(shift);
      }
    }, [shift]);

    const handleInputChange = (field: keyof Shift, value: any) => {
      setFormData({ ...formData, [field]: value });
      
      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors({ ...errors, [field]: '' });
      }
    };

    const handleDateChange = (index: number, updatedDate: ShiftDate) => {
      const updatedDates = [...formData.dates];
      updatedDates[index] = updatedDate;
      setFormData({ ...formData, dates: updatedDates });
    };

    const handleRemoveDate = (index: number) => {
      const updatedDates = formData.dates.filter((_, i) => i !== index);
      setFormData({ ...formData, dates: updatedDates });
    };

    const handleOpenNewDateDialog = () => {
      setNewDate({ ...defaultShiftDate });
      setSelectedDate(new Date());
      setNewDateDialogOpen(true);
    };

    const handleNewDateChange = (field: keyof ShiftDate, value: any) => {
      setNewDate({ ...newDate, [field]: value });
    };

    const handleSelectedDateChange = (date: Date | null) => {
      setSelectedDate(date);
      if (date) {
        setNewDate({
          ...newDate,
          date: format(date, 'dd-MM-yyyy')
        });
      }
    };

    const handleAddDate = () => {
      setFormData({
        ...formData,
        dates: [...formData.dates, newDate]
      });
      setNewDateDialogOpen(false);
    };

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      } else if (formData.title.length > 100) {
        newErrors.title = 'Title must be less than 100 characters';
      }
      
      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters';
      }
      
      if (formData.dates.length === 0) {
        newErrors.dates = 'At least one date is required';
      } else if (formData.dates.length > 10) {
        newErrors.dates = 'Maximum 10 dates allowed';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm()) {
        onSubmit(formData);
      }
    };

    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {shift ? 'Edit Shift' : 'Create Shift'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid >
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title || 'Required, max 100 characters'}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            
            <Grid >
              <TextField
                label="Description"
                fullWidth
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description || 'Optional, max 500 characters'}
                multiline
                rows={4}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>
            
            <Grid >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Dates
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={handleOpenNewDateDialog}
                  disabled={formData.dates.length >= 10}
                >
                  Add Date
                </Button>
              </Box>
              
              {errors.dates && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {errors.dates}
                </Typography>
              )}
              
              {formData.dates.length === 0 && (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No dates added yet. Click "Add Date" to add a shift date.
                </Typography>
              )}
              
              {formData.dates.map((date, index) => (
                <ShiftDateItem
                  key={index}
                  date={date}
                  index={index}
                  onUpdate={handleDateChange}
                  onRemove={handleRemoveDate}
                />
              ))}
            </Grid>
            
            <Grid >
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                {onDelete && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                )}
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ ml: onDelete ? 0 : 'auto' }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
        
        {/* New Date Dialog */}
        <Dialog open={newDateDialogOpen} onClose={() => setNewDateDialogOpen(false)}>
          <DialogTitle>Add New Shift Date</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={handleSelectedDateChange}
                  format="dd-MM-yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'normal'
                    }
                  }}
                />
              </LocalizationProvider>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid>
                  <TextField
                    label="Start Time"
                    type="time"
                    fullWidth
                    value={newDate.startTime}
                    onChange={(e) => handleNewDateChange('startTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                  />
                </Grid>
                
                <Grid>
                  <TextField
                    label="End Time"
                    type="time"
                    fullWidth
                    value={newDate.endTime}
                    onChange={(e) => handleNewDateChange('endTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                label="Price"
                type="number"
                fullWidth
                margin="normal"
                value={newDate.price}
                onChange={(e) => handleNewDateChange('price', Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="new-date-type-label">Type</InputLabel>
                <Select
                  labelId="new-date-type-label"
                  value={newDate.type}
                  label="Type"
                  onChange={(e) => handleNewDateChange('type', e.target.value)}
                >
                  <MenuItem value={ShiftType.CONSULTATION}>Consultation</MenuItem>
                  <MenuItem value={ShiftType.TELEPHONE}>Telephone</MenuItem>
                  <MenuItem value={ShiftType.AMBULANCE}>Ambulance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewDateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDate} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  };

  export default ShiftForm;