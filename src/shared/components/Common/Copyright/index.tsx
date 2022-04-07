import React from 'react';

import {Link, Typography} from '@mui/material';

interface IProps {
  link?: string;
  website?: string;
}

export const Copyright: React.FC<IProps> = ({
  link = 'www.guilhermeddc.com.br',
  website = 'Poderosa Stock',
}) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={link}>
        {website}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
