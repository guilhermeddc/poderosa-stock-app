import React, {useCallback, useMemo, useState} from 'react';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import {Link as RouteLink} from 'react-router-dom';

import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  SellRounded,
} from '@mui/icons-material';
import {
  Grid,
  MenuItem,
  Stack,
  useMediaQuery,
  Tooltip,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Link,
} from '@mui/material';
import {
  Button,
  DataGrid,
  DetailInfo,
  FilterData,
  InputSearch,
  LinearDeterminate,
  ModalConfirm,
  Subtitle,
  Title,
} from 'shared/components';
import {renderNumber} from 'shared/helpers/renderNumber';
import {useAuth} from 'shared/hooks';
import {feedback} from 'shared/services/alertService';
import {IProduct, productService} from 'shared/services/api/product';
import {IProvider, providerService} from 'shared/services/api/provider';
import {sellerService} from 'shared/services/api/seller';
import {IUser} from 'shared/services/api/user';

import {ModalProduct} from './ModalProduct';

export const Product: React.FC = () => {
  const [product, setProduct] = useState<IProduct | undefined>();
  const [seller, setSeller] = useState('');
  const [provider, setProvider] = useState('');
  const [filter, setFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [productSold, setProductSold] = useState(false);
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);
  const [openModalConfirmSold, setOpenModalConfirmSold] = useState(false);

  const matches = useMediaQuery('(min-width:769px)');
  const queryClient = useQueryClient();
  const {isAdmin} = useAuth();

  const {data, isLoading} = useQuery('products', () =>
    productService.getProducts(),
  );

  const {data: sellers} = useQuery('sellers', () => sellerService.getSellers());

  const {data: providers} = useQuery('providers', () =>
    providerService.getProviders(),
  );

  const mutationDelete = useMutation(
    () => productService.deleteProduct(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setProductId('');
        setOpenModalConfirmExclude(false);
        feedback('Registro excluído com sucesso', 'success');
      },
      onError: () => {
        setProductId('');
        setOpenModalConfirmExclude(false);
        feedback('Erro ao excluir registro', 'error');
      },
    },
  );

  const mutationUpdate = useMutation(
    (sold: boolean) => productService.changeSoldProduct(productId, sold),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setProductId('');
        setOpenModalConfirmSold(false);
        feedback('Registro atualizado com sucesso', 'success');
      },
      onError: () => {
        setProductId('');
        setOpenModalConfirmSold(false);
        feedback('Erro ao atualizar registro', 'error');
      },
    },
  );

  const filteredData = useMemo(() => {
    if (data?.products) {
      const itemFiltered = (item: IProduct) =>
        item.description.toLowerCase().includes(filter.toLowerCase()) ||
        item.size.toLowerCase().includes(filter.toLowerCase()) ||
        item.code.toLowerCase().includes(filter.toLowerCase());

      if (seller && provider) {
        return data?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === seller &&
            item.provider.id === provider,
        );
      }

      if (seller) {
        return data?.products.filter(
          (item) => itemFiltered(item) && item.seller?.id === seller,
        );
      }

      if (provider) {
        return data?.products.filter(
          (item) => itemFiltered(item) && item.provider.id === provider,
        );
      }

      return data?.products.filter((item) => itemFiltered(item));
    }
    return [];
  }, [data, filter, provider, seller]);

  const handleResetFilter = useCallback(() => {
    setFilter('');
    setSeller('');
    setProvider('');
  }, []);

  const handleEditModal = useCallback((row: IProduct) => {
    setProduct(row);

    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setProduct(undefined);
    setProductId('');

    setOpenModal(false);
    setOpenModalConfirmExclude(false);
    setOpenModalConfirmSold(false);
  }, []);

  const handleClickModal = useCallback(() => {
    setOpenModal(false);

    setProduct(undefined);
    queryClient.invalidateQueries('products');
  }, [queryClient]);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setProductId(id);
  }, []);

  const handleSold = useCallback((id: string, sold: boolean) => {
    setOpenModalConfirmSold(true);

    setProductId(id);
    setProductSold(sold);
  }, []);

  if (isLoading) {
    return <LinearDeterminate />;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={isAdmin ? 6 : 12}>
          <Title title="Gestão de produtos" />
        </Grid>

        {isAdmin && (
          <Grid item xs={12} sm={6}>
            <Stack direction="row" justifyContent="flex-end">
              <Button
                fullWidth={!matches}
                label="Adicionar"
                startIcon={<AddRounded />}
                variant="outlined"
                onClick={() => setOpenModal(true)}
                disabled={isLoading}
              />
            </Stack>
          </Grid>
        )}

        {isAdmin ? (
          <>
            <Grid item xs={12} sm={3}>
              <DetailInfo data={data?.totalQuantity || 0} title="Quantidade" />
            </Grid>

            <Grid item xs={12} sm={3}>
              <DetailInfo
                data={`R$ ${data?.totalPurchaseValue.toFixed(2) || 0}`}
                title="Total de compra"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <DetailInfo
                data={`R$ ${data?.totalSaleValue.toFixed(2) || 0}`}
                title="Total de venda"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <DetailInfo
                data={`R$ ${data?.totalProfitValue.toFixed(2) || 0}`}
                title="Total de lucro"
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={4}>
              <DetailInfo
                data={data?.totalQuantity || 0}
                value={data?.totalSaleValue}
                title="Total"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DetailInfo
                data={data?.totalQuantityInStock || 0}
                value={data?.totalSaleValueInStock}
                title="Em estoque"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DetailInfo
                data={data?.totalQuantitySold || 0}
                value={data?.totalSaleValueSold}
                title="Vendidos"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <FilterData>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InputSearch
                  placeholder="Pesquisar por código, tamanho ou descrição..."
                  value={filter}
                  onChange={({target}) => setFilter(target.value)}
                />
              </Grid>

              {isAdmin && (
                <Grid item xs={12} sm={3}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="seller">Vendedor(a)s</InputLabel>
                    <Select
                      label="Vendedor(a)s"
                      id="seller"
                      labelId="seller"
                      value={seller || ''}
                      onChange={({target}) => setSeller(target.value)}>
                      <MenuItem value="">Todas</MenuItem>
                      {sellers?.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={isAdmin ? 3 : 6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="provider">Fábricas</InputLabel>
                  <Select
                    label="Fábricas"
                    id="provider"
                    labelId="provider"
                    value={provider || ''}
                    onChange={({target}) => setProvider(target.value)}>
                    <MenuItem value="">Todas</MenuItem>
                    {providers?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    label="Limpar filtros"
                    minWidth={180}
                    onClick={handleResetFilter}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FilterData>
        </Grid>

        <Grid item xs={12}>
          <Subtitle subtitle="Produtos" />
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            columns={[
              {
                field: 'acoes',
                headerName: 'Ações',
                align: 'center',
                headerAlign: 'center',
                minWidth: 150,
                disableColumnMenu: true,
                disableReorder: true,
                disableExport: true,
                sortable: false,
                renderCell: (params) => (
                  <>
                    {isAdmin && (
                      <>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => handleEditModal(params.row)}>
                            <EditRounded color="action" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Deletar">
                          <IconButton
                            onClick={() => handleDelete(params.row.id)}>
                            <DeleteRounded color="error" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    <Tooltip
                      title={
                        params.row.sold
                          ? 'Retificar venda'
                          : 'Marcar como vendido'
                      }>
                      <IconButton
                        onClick={() =>
                          handleSold(params.row.id, params.row.sold)
                        }>
                        <SellRounded
                          color={params.row.sold ? 'success' : 'secondary'}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              },
              {
                field: 'code',
                headerName: 'Código',
                align: 'center',
                headerAlign: 'center',
                minWidth: 130,
              },
              {
                field: 'description',
                headerName: 'Descrição',
                minWidth: isAdmin ? 180 : 250,
              },
              {
                field: 'size',
                headerName: 'Tamanho',
                align: 'center',
                headerAlign: 'center',
              },
              {
                field: 'purchaseValue',
                headerName: 'Valor de compra',
                hide: !isAdmin,
                align: 'center',
                headerAlign: 'center',
                minWidth: 130,
                renderCell: (params) => renderNumber(params.row.purchaseValue),
              },
              {
                field: 'saleValue',
                headerName: isAdmin ? 'Valor de venda' : 'Valor',
                minWidth: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => renderNumber(params.row.saleValue),
              },
              {
                field: 'profitValue',
                headerName: 'Lucro',
                hide: !isAdmin,
                minWidth: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => renderNumber(params.row.profitValue),
              },
              {
                field: 'sold',
                headerName: 'Vendido',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (params.row.sold ? 'Sim' : 'Não'),
              },
              {
                field: 'seller',
                headerName: 'Vendedor',
                hide: !isAdmin,
                renderCell: (params) => (
                  <Link
                    component={RouteLink}
                    to={`/vendedores/${params.row.seller?.id}`}>
                    {params.row.seller?.name}
                  </Link>
                ),
                minWidth: 180,
              },
              {
                field: 'provider',
                headerName: 'Fábrica',
                renderCell: (params) => params.row.provider.name,
                minWidth: 180,
              },
            ]}
            rows={filteredData}
          />
        </Grid>
      </Grid>

      <ModalProduct
        openModal={openModal}
        onClick={handleClickModal}
        onClose={handleCloseModal}
        initialData={product}
        sellers={sellers as IUser[]}
        providers={providers as IProvider[]}
      />

      <ModalConfirm
        opened={openModalConfirmExclude}
        onClick={mutationDelete.mutate}
        onClose={handleCloseModal}
        loading={mutationDelete.isLoading}
      />

      <ModalConfirm
        title={productSold ? 'Retificar venda' : 'Vender produto'}
        description={`Deseja realmente ${
          productSold ? 'retificar a venda deste' : 'vender este'
        } produto?`}
        labelSaveButton="Salvar"
        opened={openModalConfirmSold}
        onClick={() => mutationUpdate.mutate(!productSold)}
        onClose={handleCloseModal}
        loading={mutationUpdate.isLoading}
      />
    </>
  );
};

export default Product;
