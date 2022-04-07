import React from 'react';

import {Box, Grid, Paper} from '@mui/material';
import {background} from 'shared/assets';

export const PublicLayout: React.FC = ({children}) => {
  return (
    <Grid container component="main" sx={{height: '100vh'}}>
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};
