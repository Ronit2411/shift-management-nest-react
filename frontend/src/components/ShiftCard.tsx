import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Shift, ShiftDate } from '../types/shifts';
import { format } from 'date-fns';
import { setCurrentShift } from '../store/features/shifts/shiftSlice';
import { useDispatch } from 'react-redux';

interface ShiftCardProps {
  shift: Shift;
   setOpenDrawer: (type: string) => void;
}

const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMM yyyy');
};

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, setOpenDrawer }) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(setCurrentShift(shift));
    setOpenDrawer('edit')
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={shift.title}
        action={
          <IconButton onClick={handleEdit} aria-label="edit">
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent>
        {shift.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {shift.description}
          </Typography>
        )}
        <Typography variant="h6" component="div" sx={{ mt: 2, mb: 1 }}>
          Dates
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shift.dates.map((date: ShiftDate, index) => (
                <TableRow key={date.id || index}>
                  <TableCell>{formatDate(date.date)}</TableCell>
                  <TableCell>{date.startTime}</TableCell>
                  <TableCell>{date.endTime}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{date.type.toLowerCase()}</TableCell>
                  <TableCell align="right">€{date.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ShiftCard;