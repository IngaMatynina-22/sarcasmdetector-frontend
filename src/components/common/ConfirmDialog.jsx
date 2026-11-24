import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const ConfirmDialog = ({ open, onClose, title, message, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Скасувати
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Підтвердити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;