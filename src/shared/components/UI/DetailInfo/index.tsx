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
      variant="outlined"
      bgcolor="primary.main"
      p={3}
      spacing={1}
      alignItems="center">
      <Typography
        color="whitesmoke"
        variant={matches ? 'h4' : 'h6'}
        align="center">
        {data}
      </Typography>
      {value && (
        <Typography color="whitesmoke" align="center" variant="caption">{`R$ ${
          value.toFixed(2) || 0
        }`}</Typography>
      )}
      <Typography
        color="whitesmoke"
        variant={matches ? 'body1' : 'body2'}
        align="center">
        {title}
      </Typography>
    </Stack>
  );
};
