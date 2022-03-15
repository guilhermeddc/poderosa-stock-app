import React from 'react';

import {SearchRounded} from '@mui/icons-material';
import {
  InputAdornment,
  TextField,
  OutlinedTextFieldProps,
  Paper,
} from '@mui/material';

export const InputSearch: React.FC<OutlinedTextFieldProps> = ({...props}) => {
  return (
    <Paper elevation={4}>
      <TextField
        fullWidth
        style={{
          padding: 0,
          margin: 0,
        }}
        {...props}
        InputProps={{
          style: {
            height: 40,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded color="disabled" />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};
