import React from 'react';

import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControlLabel,
} from '@mui/material';

export const Checkbox: React.FC<CheckboxProps & {label: string}> = ({
  label,
  ...rest
}) => {
  return (
    <FormControlLabel
      control={<MuiCheckbox color="primary" {...rest} />}
      label={label}
    />
  );
};
