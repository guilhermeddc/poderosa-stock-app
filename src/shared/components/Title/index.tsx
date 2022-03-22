import React from 'react';

import {Typography, useMediaQuery} from '@mui/material';

interface IProps {
  title: string;
}

export const Title: React.FC<IProps> = ({title}) => {
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <Typography
      fontWeight={matches ? 400 : 500}
      variant={matches ? 'h4' : 'h5'}
      color="primary">
      {title}
    </Typography>
  );
};
