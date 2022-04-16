import React from 'react';
import {useQuery} from 'react-query';

import {Grid} from '@mui/material';
import {Title} from 'shared/components';
import {movementsService} from 'shared/services/api/movementsService';

import {ModalMovement} from './ModalMovement';

const Movements: React.FC = () => {
  const {data} = useQuery('movements', () => movementsService.getMovements());

  // eslint-disable-next-line
  console.log('*** data', data);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title title="Movimentos" />
        </Grid>
      </Grid>

      <ModalMovement onClose={() => null} openModal={true} />
    </>
  );
};

export default Movements;
