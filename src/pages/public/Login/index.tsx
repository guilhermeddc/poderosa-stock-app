import React from 'react';

import {Box, Button, Typography, useMediaQuery} from '@mui/material';
import {google, logo} from 'shared/assets';
import {Copyright} from 'shared/components';
import {useAuth} from 'shared/hooks';

export const Login: React.FC = () => {
  const {signIn} = useAuth();

  const matches = useMediaQuery('(min-width:769px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Box>
        <img src={logo} alt="logo poderosa stock" width={matches ? 350 : 250} />
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

        <Box sx={{mt: 5, mb: 5}}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
