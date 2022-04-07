import React from 'react';

import {Facebook} from '@mui/icons-material';
import {Box, Button, Stack, Typography, useMediaQuery} from '@mui/material';
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

      <Stack component="form" noValidate gap={2} mt={5}>
        <Button
          variant="contained"
          onClick={() => signIn('google')}
          style={{backgroundColor: 'white', color: 'black'}}>
          <Box display="flex" alignItems="center" gap={1}>
            <img src={google} width={32} />
            <Typography>Entrar com o Google</Typography>
          </Box>
        </Button>

        <Button
          variant="contained"
          onClick={() => signIn('facebook')}
          style={{backgroundColor: '#5070a8', color: 'black'}}>
          <Box display="flex" alignItems="center" gap={1}>
            <Facebook htmlColor="whitesmoke" sx={{height: 32, width: 32}} />
            <Typography color="whitesmoke">Entrar com o Facebook</Typography>
          </Box>
        </Button>

        <Box sx={{mt: 5, mb: 5}}>
          <Copyright />
        </Box>
      </Stack>
    </Box>
  );
};

export default Login;
