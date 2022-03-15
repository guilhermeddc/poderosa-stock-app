import React from 'react';

import {TextField as MuiTextField, TextFieldProps} from '@mui/material';

export const TextField: React.FC<
  TextFieldProps & {
    helper?: string;
  }
> = ({...rest}) => {
  return <MuiTextField variant="outlined" fullWidth {...rest} />;
};
