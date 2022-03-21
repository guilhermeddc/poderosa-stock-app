import React, {useCallback, useEffect, useState} from 'react';

import {AddRounded} from '@mui/icons-material';
import {Grid, Stack, Typography} from '@mui/material';
import {Button, DataGrid} from 'shared/components';
import {feedback} from 'shared/services/alertService';
import {IProduct, productService} from 'shared/services/api/product';

import {ModalProduct} from './components/ModalProduct';

export const Product: React.FC = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await productService.getProducts();

      setData(response);
    } catch (error) {
      feedback('Erro ao carregar os dados', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  // eslint-disable-next-line
  console.log('*** data', data);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600} variant="h4" color="primary">
              Produtos
            </Typography>

            <Button
              label="Adicionar novo"
              startIcon={<AddRounded />}
              variant="outlined"
              onClick={() => setOpenModal(true)}
              disabled={loading}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            columns={[
              {
                field: 'code',
                headerName: 'Código',
              },
              {
                field: 'description',
                headerName: 'Descrição',
                minWidth: 250,
              },
              {
                field: 'size',
                headerName: 'Tamanho',
              },
              {
                field: 'purchaseValue',
                headerName: 'Valor de compra',
                minWidth: 130,
              },
              {
                field: 'saleValue',
                headerName: 'Valor de venda',
                minWidth: 130,
              },
              {
                field: 'profitValue',
                headerName: 'Lucro',
                minWidth: 130,
              },
              {
                field: 'sold',
                headerName: 'Vendido',
              },
              {
                field: 'seller',
                headerName: 'Vendedor',
              },
            ]}
            rows={data}
          />
        </Grid>
      </Grid>

      <ModalProduct
        openModal={openModal}
        onClick={() => setOpenModal(false)}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default Product;
