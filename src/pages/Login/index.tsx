import React from 'react';

import {Box, Button, Grid, Paper, Typography} from '@mui/material';
import {background, google, logo} from 'shared/assets';
import {Copyright} from 'shared/components';
import {useAuth} from 'shared/hooks';

export const Login: React.FC = () => {
  const {signIn} = useAuth();
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
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}>
          <Box sx={{mt: 5}}>
            <img src={logo} alt="logo poderosa stock" width={350} />
          </Box>

          <Box component="form" noValidate sx={{mt: 5}}>
            <Button
              variant="contained"
              onClick={signIn}
              style={{backgroundColor: 'white', color: 'black'}}>
              <Box display="flex" alignItems="center" gap={1}>
                <img src={google} width={32} />
                <Typography>Entrar com o Google</Typography>
              </Box>
            </Button>

            <Box sx={{mt: 5}}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;