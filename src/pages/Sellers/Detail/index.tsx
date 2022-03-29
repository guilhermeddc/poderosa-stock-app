import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {
  Avatar,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {DataGrid, DetailInfo, Subtitle} from 'shared/components';
import {cpfMask, phoneMask} from 'shared/helpers/masks';
import {renderNumber} from 'shared/helpers/renderNumber';
import {feedback} from 'shared/services/alertService';
import {IListProduct, ISeller, sellerService} from 'shared/services/api/seller';

type IParams = {
  id: string;
};

export const Detail: React.FC = () => {
  const [data, setData] = useState<ISeller | undefined>();
  const [productsData, setProductsData] = useState<IListProduct | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const {id} = useParams<IParams>();
  const matches = useMediaQuery('(min-width:600px)');

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      if (id) {
        const response = await sellerService.getSeller(id);
        const productResponse = await sellerService.getSellerProducts(id);

        setProductsData(productResponse);
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{width: 150, height: 150}} src={data?.imageUrl} />

          <Box>
            <Typography variant={matches ? 'h4' : 'h6'} align="center">
              {data?.name}
            </Typography>
            <Typography variant={matches ? 'body1' : 'body2'} align="center">
              CPF: {cpfMask(data?.cpf)}
            </Typography>
            <Typography variant={matches ? 'body1' : 'body2'} align="center">
              Telefone: {phoneMask(data?.phone)}
            </Typography>
          </Box>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={6} sm={3}>
        <DetailInfo
          data={productsData?.totalQuantity || 0}
          title="Quantidade de produtos"
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <DetailInfo
          data={`R$ ${productsData?.totalPurchaseValue.toFixed(2) || 0}`}
          title="Valor total de compra"
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <DetailInfo
          data={`R$ ${productsData?.totalSaleValue.toFixed(2) || 0}`}
          title="Valor total de venda"
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <DetailInfo
          data={`R$ ${productsData?.totalProfitValue.toFixed(2) || 0}`}
          title="Valor total de lucro"
        />
      </Grid>

      <Grid item xs={12}>
        <Subtitle subtitle="Produtos" />
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
              minWidth: 180,
            },
            {
              field: 'size',
              headerName: 'Tamanho',
            },
            {
              field: 'purchaseValue',
              headerName: 'Valor de compra',
              minWidth: 130,
              renderCell: (params) => renderNumber(params.row.purchaseValue),
            },
            {
              field: 'saleValue',
              headerName: 'Valor de venda',
              minWidth: 130,
              renderCell: (params) => renderNumber(params.row.saleValue),
            },
            {
              field: 'profitValue',
              headerName: 'Lucro',
              minWidth: 130,
              renderCell: (params) => renderNumber(params.row.profitValue),
            },
            {
              field: 'sold',
              headerName: 'Vendido',
              renderCell: (params) => (params.row.sold ? 'Sim' : 'Não'),
            },
            {
              field: 'provider',
              headerName: 'Fábrica',
              renderCell: (params) => params.row.provider.name,
              minWidth: 180,
            },
          ]}
          rows={productsData?.productList || []}
        />
      </Grid>
    </Grid>
  );
};

export default Detail;
