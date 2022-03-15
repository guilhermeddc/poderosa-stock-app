import React from 'react';

import {Box, Card, Typography} from '@mui/material';

interface IProps {
  value: string;
  description: string;
}

export const CardInfo: React.FC<IProps> = ({value, description, children}) => {
  return (
    <Box
      component={Card}
      variant="outlined"
      bgcolor="#018781"
      p="20px 24px 24px"
      display="flex"
      justifyContent="space-between">
      <Box>
        <Typography color="white" fontSize={34}>
          {value}
        </Typography>
        <Typography color="white" fontSize={13}>
          {description}
        </Typography>
      </Box>

      <Box>{children}</Box>
    </Box>
  );
};
