import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import {Facebook} from '@mui/icons-material';
import {Box, Button, Stack, Typography, useMediaQuery} from '@mui/material';
import {google, logo} from 'shared/assets';
import {Copyright} from 'shared/components';
import {useAuth} from 'shared/hooks';

export const Login: React.FC = () => {
  const {signIn} = useAuth();

  const matches = useMediaQuery('(min-width:769px)');
  const navigate = useNavigate();

  const handleSignIn = useCallback(
    (type: string) => {
      signIn(type);

      navigate('/');
    },
    [signIn, navigate],
  );

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
          onClick={() => handleSignIn('google')}
          style={{backgroundColor: 'white', color: 'black'}}>
          <Box display="flex" alignItems="center" gap={1}>
            <img src={google} width={32} />
            <Typography>Entrar com o Google</Typography>
          </Box>
        </Button>

        <Button
          variant="contained"
          onClick={() => handleSignIn('facebook')}
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
