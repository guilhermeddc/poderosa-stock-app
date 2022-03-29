import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Link as RouteLink} from 'react-router-dom';

import {AddRounded, DeleteRounded, EditRounded} from '@mui/icons-material';
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
import {feedback} from 'shared/services/alertService';
import {IProduct, productService} from 'shared/services/api/product';
import {IProvider, providerService} from 'shared/services/api/provider';
import {ISeller, sellerService} from 'shared/services/api/seller';

import {ModalProduct} from './ModalProduct';

interface ITotalValues {
  totalSaleValue: number;
  totalProfitValue: number;
  totalQuantity: number;
  totalPurchaseValue: number;
}

export const Product: React.FC = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [totalValues, setTotalValues] = useState<ITotalValues | undefined>();
  const [product, setProduct] = useState<IProduct | undefined>();
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [seller, setSeller] = useState('');
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [provider, setProvider] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const matches = useMediaQuery('(min-width:600px)');

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const resData = await productService.getProducts();
      const resSeller = await sellerService.getSellers();
      const resProvider = await providerService.getProviders();

      setProviders(resProvider);
      setSellers(resSeller);
      setData(resData.products);

      setTotalValues({
        totalSaleValue: resData.totalSaleValue,
        totalProfitValue: resData.totalProfitValue,
        totalQuantity: resData.totalQuantity,
        totalPurchaseValue: resData.totalPurchaseValue,
      });
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
      const itemFiltered = (item: IProduct) =>
        item.description.toLowerCase().includes(filter.toLowerCase()) ||
        item.size.toLowerCase().includes(filter.toLowerCase()) ||
        item.code.toLowerCase().includes(filter.toLowerCase());

      if (seller && provider) {
        return data.filter(
          (item) =>
            itemFiltered(item) &&
            item.seller?.id === seller &&
            item.provider.id === provider,
        );
      }

      if (seller) {
        return data.filter(
          (item) => itemFiltered(item) && item.seller?.id === seller,
        );
      }

      if (provider) {
        return data.filter(
          (item) => itemFiltered(item) && item.provider.id === provider,
        );
      }

      return data.filter((item) => itemFiltered(item));
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

    setOpenModal(false);
  }, []);

  const handleClickModal = useCallback(() => {
    setProduct(undefined);

    setOpenModal(false);
    getData();
  }, [getData]);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setIdDeleted(id);
  }, []);

  const handleConfirmDeleted = useCallback(async () => {
    try {
      setLoading(true);
      await productService.deleteProduct(idDeleted);

      await getData();

      feedback('Registro excluído com sucesso', 'success');
    } catch (error) {
      feedback('Erro ao tentar excluir', 'error');
    }
    setLoading(false);
    setIdDeleted('');
    setOpenModalConfirmExclude(false);
  }, [getData, idDeleted]);

  if (loading || data.length === 0) {
    <LinearDeterminate />;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Title title="Gestão de produtos" />
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

        <Grid item xs={6} sm={3}>
          <DetailInfo
            data={totalValues?.totalQuantity || 0}
            title="Quantidade de produtos"
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <DetailInfo
            data={`R$ ${totalValues?.totalPurchaseValue.toFixed(2) || 0}`}
            title="Valor total de compra"
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <DetailInfo
            data={`R$ ${totalValues?.totalSaleValue.toFixed(2) || 0}`}
            title="Valor total de venda"
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <DetailInfo
            data={`R$ ${totalValues?.totalProfitValue.toFixed(2) || 0}`}
            title="Valor total de lucro"
          />
        </Grid>

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

              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="seller">Vendedor(a)s</InputLabel>
                  <Select
                    label="Vendedor(a)s"
                    id="seller"
                    labelId="seller"
                    value={seller || ''}
                    onChange={({target}) => setSeller(target.value)}>
                    {sellers &&
                      sellers.length > 0 &&
                      sellers.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="provider">Fábricas</InputLabel>
                  <Select
                    label="Fábricas"
                    id="provider"
                    labelId="provider"
                    value={provider || ''}
                    onChange={({target}) => setProvider(target.value)}>
                    {providers &&
                      providers.length > 0 &&
                      providers.map((item) => (
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
                renderCell: (params) => (
                  <>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditModal(params.row)}>
                        <EditRounded color="primary" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Deletar">
                      <IconButton onClick={() => handleDelete(params.row.id)}>
                        <DeleteRounded color="primary" />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              },
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
                field: 'seller',
                headerName: 'Vendedor',
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
        sellers={sellers}
        providers={providers}
      />

      <ModalConfirm
        opened={openModalConfirmExclude}
        onClick={handleConfirmDeleted}
        onClose={() => {
          setOpenModalConfirmExclude(false), setIdDeleted('');
        }}
        loading={loading}
      />
    </>
  );
};

export default Product;
