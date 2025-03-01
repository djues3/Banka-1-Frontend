import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ onClick, label = "Add New" }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        height: '42px',
        marginLeft: '10px',
        backgroundColor: '#1976d2',
        '&:hover': {
          backgroundColor: '#115293'
        }
      }}
    >
      {label}
    </Button>
  );
};

export default AddButton;