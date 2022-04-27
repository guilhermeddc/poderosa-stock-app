import React from 'react';

import {Stack, Paper, Typography, useMediaQuery} from '@mui/material';

interface IProps {
  data?: string | number;
  title: string;
  value?: number;
}

export const DetailInfo: React.FC<IProps> = ({data, title, value}) => {
  const matches = useMediaQuery('(min-width:769px)');

  return (
    <Stack
      component={Paper}
      bgcolor="primary.main"
      alignContent="stretch"
      p={2}
      spacing={1}
      alignItems="stretch">
      <Typography color="whitesmoke" variant="h4" align="center">
        {data}
      </Typography>
      {value && (
        <Typography color="whitesmoke" align="center" variant="h4">{`R$ ${
          value.toFixed(2) || 0
        }`}</Typography>
      )}
      <Typography
        color="whitesmoke"
        variant={matches ? 'h6' : 'body2'}
        align="center">
        {title}
      </Typography>
    </Stack>
  );
};
