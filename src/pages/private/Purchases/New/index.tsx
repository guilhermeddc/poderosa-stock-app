import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useNavigate} from 'react-router-dom';

import {AddRounded, DeleteRounded, EditRounded} from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  useMediaQuery,
  Tooltip,
  IconButton,
} from '@mui/material';
import {FormHandles} from '@unform/core';
import {
  Button,
  DataGrid,
  DetailInfo,
  Form,
  LinearDeterminate,
  ModalConfirm,
  Select,
  Subtitle,
  TextField,
  Title,
} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {moneyMask} from 'shared/helpers/masks';
import {useTitle} from 'shared/hooks';
import {feedback} from 'shared/services/alertService';
import {IProduct, productService} from 'shared/services/api/product';
import {ICreatePurchase, purchaseService} from 'shared/services/api/purchases';
import * as Yup from 'yup';

import {ModalProduct} from '../ModalProduct';

const PurchaseNew: React.FC = () => {
  const [idPurchase, setIdPurchase] = useState('');
  const [product, setProduct] = useState<IProduct | undefined>();
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const matches = useMediaQuery('(min-width:769px)');
  const queryClient = useQueryClient();
  const {setTitle} = useTitle();
  const navigate = useNavigate();

  useEffect(() => {
    purchaseService.createPurchase().then((response) => {
      setIdPurchase(response);
    });
  }, []);

  const {data: purchaseTypes} = useQuery('purchaseTypes', () =>
    purchaseService.getPurchaseTypes(),
  );

  const {data: productData, isLoading: isLoadingPD} = useQuery(
    ['purchaseProducts', idPurchase],
    () => purchaseService.getPurchaseProducts(idPurchase),
  );

  const mutationDelete = useMutation(
    () => productService.deleteProduct(productId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('purchaseProducts');
        setProductId('');
        setOpenModalConfirmExclude(false);
        feedback('Registro excluído com sucesso', 'success');
        formRef.current?.submitForm();
      },
      onError: () => {
        setProductId('');
        setOpenModalConfirmExclude(false);
        feedback('Erro ao excluir registro', 'error');
      },
    },
  );

  const updatePurchase = useMutation((data: ICreatePurchase) =>
    purchaseService.updatePurchase(idPurchase, data),
  );

  useEffect(() => {
    setTitle('Nova compra');
  }, [setTitle]);

  const handleClickModal = useCallback(async () => {
    setOpenModal(false);

    setProduct(undefined);
    await queryClient.invalidateQueries('purchaseProducts');
    formRef.current?.submitForm();
  }, [queryClient]);

  const handleCloseModal = useCallback(() => {
    setProduct(undefined);
    setProductId('');

    setOpenModal(false);
    setOpenModalConfirmExclude(false);
  }, []);

  const handleCancelPurchase = useCallback(async () => {
    await purchaseService.deletePurchase(
      idPurchase,
      productData?.products?.map((product) => product.id),
    );

    navigate('/compras');
  }, [idPurchase, navigate, productData]);

  const handleEditModal = useCallback((row: IProduct) => {
    setProduct(row);

    setOpenModal(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setProductId(id);
  }, []);

  const handleOnSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({});

        await schema.validate(data, {
          abortEarly: false,
        });

        updatePurchase.mutate({
          ...data,
          profitValue: productData?.totalProfitValue || 0,
          quantity: productData?.totalQuantity || 0,
          purchaseValue: productData?.totalPurchaseValue || 0,
          saleValue: productData?.totalProfitValue || 0,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          formRef.current?.setErrors(errors);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      productData?.totalProfitValue,
      productData?.totalPurchaseValue,
      productData?.totalQuantity,
      updatePurchase,
    ],
  );

  if (isLoadingPD) {
    return <LinearDeterminate />;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Title title="Nova compra" />
        </Grid>

        <Grid item xs={12}>
          <Box component={Paper} variant="outlined" p={3}>
            <Form ref={formRef} onSubmit={handleOnSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={9}>
                  <TextField name="name" label="Nome" fullWidth />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Select name="type" label="Tipo de compra" fullWidth>
                    <MenuItem value="">Selecione</MenuItem>
                    {purchaseTypes?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <DetailInfo
                    data={productData?.totalQuantity || 0}
                    title="Quantidade"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <DetailInfo
                    data={moneyMask(productData?.totalPurchaseValue || 0)}
                    title="Total de compra"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <DetailInfo
                    data={moneyMask(productData?.totalSaleValue || 0)}
                    title="Total de venda"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <DetailInfo
                    data={moneyMask(productData?.totalProfitValue || 0)}
                    title="Total de lucro"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={3}>
                    <Button
                      label={matches ? 'Cancelar compra' : 'Cancelar'}
                      variant="outlined"
                      onClick={handleCancelPurchase}
                      disabled={loading}
                      minWidth={matches ? 180 : undefined}
                      fullWidth
                    />

                    <Button
                      label={matches ? 'Salvar compra' : 'Salvar'}
                      type="submit"
                      disabled={loading}
                      minWidth={matches ? 180 : undefined}
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Subtitle subtitle="Produtos" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              fullWidth={!matches}
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
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditModal(params.row)}>
                        <EditRounded color="action" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Deletar">
                      <IconButton onClick={() => handleDelete(params.row.id)}>
                        <DeleteRounded color="error" />
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
                minWidth: 250,
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
                align: 'center',
                headerAlign: 'center',
                minWidth: 130,
                renderCell: (params) => moneyMask(params.row.purchaseValue),
              },
              {
                field: 'saleValue',
                headerName: 'Valor de venda',
                minWidth: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => moneyMask(params.row.saleValue),
              },
              {
                field: 'profitValue',
                headerName: 'Lucro',
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
                renderCell: (params) => (params.row.sold ? 'Sim' : 'Não'),
              },
              {
                field: 'provider',
                headerName: 'Fábrica',
                renderCell: (params) => params.row.provider.name,
                minWidth: 180,
              },
            ]}
            rows={productData?.products || []}
          />
        </Grid>
      </Grid>

      <ModalConfirm
        opened={openModalConfirmExclude}
        onClick={mutationDelete.mutate}
        onClose={handleCloseModal}
        loading={mutationDelete.isLoading}
      />

      <ModalProduct
        openModal={openModal}
        onClick={handleClickModal}
        onClose={handleCloseModal}
        idPurchase={idPurchase}
        initialData={product}
      />
    </>
  );
};

export default PurchaseNew;
