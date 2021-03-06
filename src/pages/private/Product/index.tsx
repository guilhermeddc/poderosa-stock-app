import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import {Link as RouteLink, useSearchParams} from 'react-router-dom';

import {AddRounded, ImageRounded, SellRounded} from '@mui/icons-material';
import {
  Grid,
  MenuItem,
  Stack,
  Tooltip,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Link,
  useMediaQuery,
} from '@mui/material';
import {GridSelectionModel} from '@mui/x-data-grid';
import {
  Button,
  DataGrid,
  DetailInfo,
  FilterData,
  InputSearch,
  LinearDeterminate,
  Modal,
  ModalConfirm,
  Subtitle,
  Title,
} from 'shared/components';
import {moneyMask} from 'shared/helpers/masks';
import {useAuth, useTitle} from 'shared/hooks';
import {feedback} from 'shared/services/alertService';
import {IProduct, productService} from 'shared/services/api/product';
import {providerService} from 'shared/services/api/provider';
import {purchaseService} from 'shared/services/api/purchases';
import {sellerService} from 'shared/services/api/seller';

import {ModalImage} from './ModalImage';

export const Product: React.FC = () => {
  const [seller, setSeller] = useState('');
  const [purchase, setPurchase] = useState('');
  const [provider, setProvider] = useState('');
  const [sellerTransfer, setSellerTransfer] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [productId, setProductId] = useState('');
  const [productIds, setProductIds] = useState<GridSelectionModel>([]);
  const [productSold, setProductSold] = useState(false);
  const [openModalConfirmSold, setOpenModalConfirmSold] = useState(false);
  const [openModalImage, setOpenModalImage] = useState(false);
  const [imagePrimary, setImagePrimary] = useState(false);

  const matches = useMediaQuery('(min-width:769px)');
  const queryClient = useQueryClient();
  const {isAdmin, user} = useAuth();
  const {setTitle} = useTitle();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) setFilter(code);
    const compra = searchParams.get('compra');
    if (compra) setPurchase(compra);
  }, [searchParams]);

  useEffect(() => {
    setTitle('Produtos');
  }, [setTitle]);

  const {data, isLoading} = useQuery(
    ['products', isAdmin],
    productService.getProducts,
    {
      enabled: isAdmin,
      refetchOnWindowFocus: false,
    },
  );

  const {data: sellerProducts, isLoading: isLoadingSellers} = useQuery(
    ['sellerProducts', isAdmin, user.id],
    () => sellerService.getSellerProducts(user.id),
    {enabled: !isAdmin},
  );

  const {data: sellers} = useQuery('sellers', sellerService.getSellers);

  const {data: providers} = useQuery('providers', providerService.getProviders);

  const {data: purchases} = useQuery('purchases', purchaseService.getPurchases);

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

  const mutationTransfer = useMutation(
    (sellerId: string) => productService.transferProducts(productIds, sellerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setOpenModal(false);
        feedback('Registro atualizado com sucesso', 'success');
      },
      onError: () => {
        setOpenModal(false);
        feedback('Erro ao atualizar registro', 'error');
      },
    },
  );

  const filteredData = useMemo(() => {
    if (data?.products || sellerProducts?.products) {
      const itemFiltered = (item: IProduct) =>
        item.description.toLowerCase().includes(filter.toLowerCase()) ||
        item.size.toLowerCase().includes(filter.toLowerCase()) ||
        item.code.toLowerCase().includes(filter.toLowerCase());

      if (seller && seller !== 'none' && provider && purchase) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === seller &&
            item.provider.id === provider &&
            item.purchase === purchase,
        );
      }

      if (seller && seller !== 'none' && provider) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === seller &&
            item.provider.id === provider,
        );
      }

      if (seller === 'none' && provider && purchase) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === '' &&
            item.provider.id === provider &&
            itemFiltered(item) &&
            item.purchase === purchase,
        );
      }

      if (seller === 'none' && provider) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === '' &&
            item.provider.id === provider,
        );
      }

      if (seller === 'none' && purchase) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === '' &&
            itemFiltered(item) &&
            item.purchase === purchase,
        );
      }

      if (seller === 'none') {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) => itemFiltered(item) && item.seller?.id === '',
        );
      }

      if (seller && purchase) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === seller &&
            itemFiltered(item) &&
            item.purchase === purchase,
        );
      }

      if (seller) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) => itemFiltered(item) && item.seller?.id === seller,
        );
      }

      if (provider && purchase) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) =>
            itemFiltered(item) &&
            item.provider.id === provider &&
            itemFiltered(item) &&
            item.purchase === purchase,
        );
      }

      if (provider) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) => itemFiltered(item) && item.provider.id === provider,
        );
      }

      if (purchase) {
        return (isAdmin ? data : sellerProducts)?.products.filter(
          (item) => itemFiltered(item) && item.purchase === purchase,
        );
      }

      return (isAdmin ? data : sellerProducts)?.products.filter((item) =>
        itemFiltered(item),
      );
    }
    return [] as IProduct[];
  }, [data, filter, isAdmin, provider, purchase, seller, sellerProducts]);

  const handleResetFilter = useCallback(() => {
    setFilter('');
    setSeller('');
    setProvider('');
    setPurchase('');
  }, []);

  const handleCloseModal = useCallback(() => {
    setProductId('');

    setOpenModal(false);
    setOpenModalConfirmSold(false);
    setOpenModalImage(false);
  }, []);

  const handleSold = useCallback((id: string, sold: boolean) => {
    setOpenModalConfirmSold(true);

    setProductId(id);
    setProductSold(sold);
  }, []);

  const handleImage = useCallback((id: string, primary: boolean) => {
    setOpenModalImage(true);
    setImagePrimary(primary);

    setProductId(id);
  }, []);

  if (isLoading || isLoadingSellers) {
    return <LinearDeterminate />;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title title="Gest??o de produtos" />
        </Grid>

        {isAdmin ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <DetailInfo data={data?.totalQuantity || 0} title="Quantidade" />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DetailInfo
                data={`R$ ${data?.totalPurchaseValue.toFixed(2) || 0}`}
                title="Total de compra"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DetailInfo
                data={`R$ ${data?.totalSaleValue.toFixed(2) || 0}`}
                title="Total de venda"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={isAdmin ? 3 : 6}>
                <InputSearch
                  placeholder="C??digo, tamanho ou descri????o..."
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
                      <MenuItem value="none">N??o atribu??dos</MenuItem>
                      {sellers?.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="provider">F??bricas</InputLabel>
                  <Select
                    label="F??bricas"
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

              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="provider">Compra</InputLabel>
                  <Select
                    label="Compra"
                    id="provider"
                    labelId="provider"
                    value={purchase || ''}
                    onChange={({target}) => setPurchase(target.value)}>
                    <MenuItem value="">Todas</MenuItem>
                    {purchases?.map((item) => (
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
                    fullWidth={!matches}
                    minWidth={180}
                    onClick={handleResetFilter}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FilterData>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Subtitle subtitle="Produtos" />
        </Grid>

        {isAdmin && (
          <Grid item xs={12} sm={6}>
            <Stack direction="row" justifyContent="flex-end">
              <Button
                fullWidth={!matches}
                variant="outlined"
                label="Transferir produtos"
                startIcon={<AddRounded />}
                onClick={() => setOpenModal(true)}
                disabled={
                  isLoading || isLoadingSellers || productIds.length === 0
                }
              />
            </Stack>
          </Grid>
        )}

        <Grid item xs={12}>
          <DataGrid
            columns={[
              {
                field: 'acoes',
                headerName: 'A????es',
                align: 'center',
                headerAlign: 'center',
                minWidth: 150,
                disableColumnMenu: true,
                disableReorder: true,
                disableExport: true,
                sortable: false,
                renderCell: (params) => (
                  <>
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

                    {isAdmin && (
                      <>
                        <Tooltip
                          title={
                            params.row.image
                              ? 'Trocar imagem principal'
                              : 'Adicionar imagem principal'
                          }>
                          <IconButton
                            onClick={() => handleImage(params.row.id, true)}>
                            <ImageRounded
                              color={params.row.image ? 'success' : 'disabled'}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            params.row.image
                              ? 'Trocar imagem secundaria'
                              : 'Adicionar imagem secundaria'
                          }>
                          <IconButton
                            onClick={() => handleImage(params.row.id, false)}>
                            <ImageRounded
                              color={
                                params.row.secondaryImage
                                  ? 'success'
                                  : 'disabled'
                              }
                            />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </>
                ),
              },
              {
                field: 'code',
                headerName: 'C??digo',
                align: 'center',
                headerAlign: 'center',
                minWidth: 130,
              },
              {
                field: 'description',
                headerName: 'Descri????o',
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
                renderCell: (params) => moneyMask(params.row.purchaseValue),
              },
              {
                field: 'saleValue',
                headerName: isAdmin ? 'Valor de venda' : 'Valor',
                minWidth: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => moneyMask(params.row.saleValue),
              },
              {
                field: 'profitValue',
                headerName: 'Lucro',
                hide: !isAdmin,
                minWidth: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => moneyMask(params.row.profitValue),
              },
              {
                field: 'sold',
                headerName: 'Vendido',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (params.row.sold ? 'Sim' : 'N??o'),
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
                headerName: 'F??brica',
                renderCell: (params) => params.row.provider.name,
                minWidth: 180,
              },
            ]}
            rows={filteredData || []}
            onSelectionModelChange={(ids) => {
              setProductIds(ids);
            }}
            checkboxSelection
          />
        </Grid>
      </Grid>

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

      <Modal
        opened={openModal}
        onClose={handleCloseModal}
        onClick={() => mutationTransfer.mutate(sellerTransfer)}
        labelSaveButton="Transferir"
        labelCloseButton="Cancelar"
        title={`Transferir ${productIds.length} ${
          productIds.length === 1 ? 'produto' : 'produtos'
        } para`}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="seller">Vendedor(a)s</InputLabel>
          <Select
            label="Vendedor(a)s"
            id="seller"
            labelId="seller"
            value={sellerTransfer || ''}
            onChange={({target}) => setSellerTransfer(target.value)}>
            {sellers?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Modal>

      <ModalImage
        primary={imagePrimary}
        openModal={openModalImage}
        onClose={handleCloseModal}
        id={productId}
      />
    </>
  );
};

export default Product;
