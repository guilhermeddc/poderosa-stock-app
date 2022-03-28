import React from 'react';

import {SearchRounded} from '@mui/icons-material';
import {InputAdornment, TextField, TextFieldProps} from '@mui/material';

export const InputSearch: React.FC<TextFieldProps> = ({...props}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Pesquisar"
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <SearchRounded color="disabled" />
          </InputAdornment>
        ),
      }}
    />
  );
};
