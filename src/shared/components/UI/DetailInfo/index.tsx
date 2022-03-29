import React from 'react';

import {Stack, Paper, Typography, useMediaQuery} from '@mui/material';

interface IProps {
  data?: string | number;
  title: string;
}

export const DetailInfo: React.FC<IProps> = ({data, title}) => {
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <Stack
      component={Paper}
      variant="outlined"
      bgcolor="primary.main"
      p={3}
      spacing={2}
      alignItems="center">
      <Typography
        color="whitesmoke"
        variant={matches ? 'h4' : 'h6'}
        align="center">
        {data}
      </Typography>
      <Typography
        color="whitesmoke"
        variant={matches ? 'body1' : 'body2'}
        align="center">
        {title}
      </Typography>
    </Stack>
  );
};
