import React from 'react';

import {CloseRounded} from '@mui/icons-material';
import {
  Avatar,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {UserForm} from 'shared/components';
import {useAuth} from 'shared/hooks';

const Home: React.FC = () => {
  const {user, signOut} = useAuth();

  return (
    <Container
      maxWidth="xs"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Stack position="absolute" top={3 * 8} right={3}>
        <Tooltip title="Sair">
          <IconButton sx={{bgcolor: 'Menu'}} onClick={signOut}>
            <CloseRounded color="primary" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        py={6}
        mx={'auto'}>
        <Avatar sx={{height: 96, width: 96}} src={user.imageUrl} />
        <Typography variant="h5" align="center">
          Bem-vindo, {user.name}
        </Typography>

        <Stack borderBottom={1} borderColor="gray.200" width="70%" />

        {!user.updated && (
          <>
            <Typography variant="body2" align="center">
              Seu cadastro está incompleto, complete-o para continuar.
            </Typography>

            <UserForm />
          </>
        )}
      </Stack>
    </Container>
  );
};

export default Home;
