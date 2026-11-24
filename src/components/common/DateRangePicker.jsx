import { Box, Button } from '@mui/material';
import { useState } from 'react';

const DateRangePicker = ({ onSelect }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSelect = (date) => {
    setEndDate(date);
    onSelect?.(startDate, endDate);
  };

  return (
    <Box sx={{ px: 1, py: 1 }}>
      <Button variant="outlined" sx={{ width: '100%' }} onClick={handleSelect}>
        Вибрати період:
        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
      </Button>
    </Box>
  );
};

export default DateRangePicker;