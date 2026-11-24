import { Box, Select, MenuItem, InputLabel, FormControl, sx } from '@mui/material';

const FilterPanel = ({ title, options, value, onChange, renderLabel }) => {
  return (
    <Box sx={{ px: 1, py: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="subtitle6" sx={{ p: 1 }}>
        {title}
      </Typography>
      <FormControl fullWidth>
        <InputLabel sx={{ shrink: true }}>Фільтр</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">
            <span>Вибрати...</span>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {renderLabel ? renderLabel(option) : option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterPanel;