import React from 'react';

import {Typography, useMediaQuery} from '@mui/material';

interface IProps {
  subtitle: string;
}

export const Subtitle: React.FC<IProps> = ({subtitle}) => {
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <Typography
      variant="h6"
      fontWeight={matches ? 400 : 300}
      textTransform="uppercase"
      color="primary">
      {subtitle}
    </Typography>
  );
};
