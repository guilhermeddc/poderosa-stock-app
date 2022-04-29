import React from 'react';
import {useQuery} from 'react-query';
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
import {
  DataGrid,
  DetailInfo,
  LinearDeterminate,
  Subtitle,
} from 'shared/components';
import {cpfMask, phoneMask, moneyMask} from 'shared/helpers/masks';
import {sellerService} from 'shared/services/api/seller';

type IParams = {
  id: string;
};

export const Detail: React.FC = () => {
  const {id} = useParams<IParams>();
  const matches = useMediaQuery('(min-width:769px)');

  const {data, isLoading} = useQuery(
    ['seller', id],
    () => sellerService.getSeller(String(id)),
    {enabled: !!id},
  );

  const {data: productsData, isLoading: isLoadingProduct} = useQuery(
    ['sellerProducts', id],
    () => sellerService.getSellerProducts(id),
    {enabled: !!id},
  );

  if (isLoading || isLoadingProduct) {
    return <LinearDeterminate />;
  }

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

      <Grid item xs={12} sm={6} md={3}>
        <DetailInfo
          data={productsData?.totalQuantity || 0}
          title="Quantidade de produtos"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <DetailInfo
          data={`R$ ${productsData?.totalPurchaseValue.toFixed(2) || 0}`}
          title="Valor total de compra"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <DetailInfo
          data={`R$ ${productsData?.totalSaleValue.toFixed(2) || 0}`}
          title="Valor total de venda"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
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
              renderCell: (params) => moneyMask(params.row.purchaseValue),
            },
            {
              field: 'saleValue',
              headerName: 'Valor de venda',
              minWidth: 130,
              renderCell: (params) => moneyMask(params.row.saleValue),
            },
            {
              field: 'profitValue',
              headerName: 'Lucro',
              minWidth: 130,
              renderCell: (params) => moneyMask(params.row.profitValue),
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
          rows={productsData?.products || []}
        />
      </Grid>
    </Grid>
  );
};

export default Detail;
