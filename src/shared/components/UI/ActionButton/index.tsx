import React, {ReactElement} from 'react';
import {useNavigate} from 'react-router-dom';

import {Box, Paper, Typography} from '@mui/material';

interface IProps {
  title: string;
  link: string;
  icon: ReactElement;
}

export const ActionButton: React.FC<IProps> = ({title, link, icon}) => {
  const navigate = useNavigate();

  return (
    <Box
      component={Paper}
      variant="outlined"
      height={116}
      m={0}
      sx={{cursor: 'pointer'}}
      onClick={() => navigate(link)}
      p={1.5}>
      <Box
        gap={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between">
        <Box
          bgcolor="#EDFAF9"
          borderRadius={50}
          height={46}
          width={46}
          display="flex"
          justifyContent="center"
          alignItems="center">
          {icon}
        </Box>
        <Typography variant="body2">{title}</Typography>
      </Box>
    </Box>
  );
};
