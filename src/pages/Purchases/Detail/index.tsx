import React, {useEffect} from 'react';

import {Grid} from '@mui/material';
import {Title} from 'shared/components';
import {useTitle} from 'shared/hooks';

const PurchaseDetail: React.FC = () => {
  const {setTitle} = useTitle();

  useEffect(() => {
    setTitle('Detalhes da compra');
  }, [setTitle]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Title title="Detalhes da compra" />
        </Grid>
      </Grid>
    </>
  );
};

export default PurchaseDetail;
