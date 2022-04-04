import React, {useEffect} from 'react';

import {Grid, Typography} from '@mui/material';
import {useAuth, useTitle} from 'shared/hooks';

const Home: React.FC = () => {
  const {setTitle} = useTitle();
  const {user} = useAuth();

  useEffect(() => {
    setTitle('Página inicial');
  }, [setTitle]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h4" color="primary">
          Página inicial
        </Typography>

        <Typography>
          Bem-vindo de volta, <strong>{user.name}</strong>.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
