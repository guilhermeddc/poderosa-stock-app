import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {AddRounded} from '@mui/icons-material';
import {Grid, Stack, Typography, useMediaQuery} from '@mui/material';
import {Button, DataGrid, FilterData, InputSearch} from 'shared/components';
import {feedback} from 'shared/services/alertService';
import {IProduct, productService} from 'shared/services/api/product';

import {ModalProduct} from './components/ModalProduct';

export const Product: React.FC = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const matches = useMediaQuery('(min-width:600px)');

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

  const filteredData = useMemo(() => {
    if (data) {
      return data.filter(
        (item) =>
          item.description.toLowerCase().includes(filter.toLowerCase()) ||
          item.code.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    return [];
  }, [data, filter]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography fontWeight={400} variant="h4" color="primary">
            Gestão de produtos
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              fullWidth={!matches}
              label="Adicionar"
              startIcon={<AddRounded />}
              variant="outlined"
              onClick={() => setOpenModal(true)}
              disabled={loading}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FilterData>
            <InputSearch
              placeholder="Pesquisar por código ou descrição..."
              value={filter}
              onChange={({target}) => setFilter(target.value)}
            />
          </FilterData>
        </Grid>

        <Grid item xs={12}>
          <Typography
            fontWeight={400}
            variant="h6"
            textTransform="uppercase"
            color="primary">
            Produtos
          </Typography>
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
            rows={filteredData}
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
