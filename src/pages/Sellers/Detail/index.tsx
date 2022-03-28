import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Grid, Typography} from '@mui/material';
import {feedback} from 'shared/services/alertService';
import {ISeller, sellerService} from 'shared/services/api/seller';

type IParams = {
  id: string;
};

export const Detail: React.FC = () => {
  const [data, setData] = useState<ISeller | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const {id} = useParams<IParams>();

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      if (id) {
        const response = await sellerService.getSeller(id);

        setData(response);
      }
    } catch (error) {
      feedback('Erro ao carregar os dados', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  // eslint-disable-next-line
  console.log('*** data', data);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body1">Vendedora</Typography>
        <Typography variant="body2">{data?.name}</Typography>
      </Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};

export default Detail;
