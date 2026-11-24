import { TextField, Icon } from '@mui/material';
import { ClearIcon } from '@mui/icons-material';

const SearchInput = ({ placeholder = 'Пошук', value, onChange, renderIcon }) => {
  return (
    <TextField
      margin="normal"
      label="Пошук"
      variant="outlined"
      sx={{ width: 300 }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      endAdornment={
        <Icon position="end">
          {renderIcon || <ClearIcon />}
        </Icon>
      }
    />
  );
};

export default SearchInput;