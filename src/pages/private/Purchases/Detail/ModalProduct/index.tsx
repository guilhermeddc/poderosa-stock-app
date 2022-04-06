import React, {useCallback, useRef, useState} from 'react';
import {useQuery} from 'react-query';

import {Divider, Grid, MenuItem, Typography} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, Select, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {IProduct, productService} from 'shared/services/api/product';
import {providerService} from 'shared/services/api/provider';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClick(): void;
  onClose(): void;
  initialData?: IProduct;
  idPurchase?: string;
}

export const ModalProduct: React.FC<IProps> = ({
  openModal,
  onClick,
  onClose,
  initialData,
  idPurchase,
}) => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const {data: providers} = useQuery('providers', () =>
    providerService.getProviders(),
  );

  const handleOnSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const initialSchema = {
          code: Yup.string().required('Código é obrigatório'),
          description: Yup.string().required('Descrição é obrigatório'),
          size: Yup.string().required('Tamanho é obrigatório'),
          purchaseValue: Yup.number().required('Valor de compra é obrigatório'),
          saleValue: Yup.number().required('Valor de venda é obrigatório'),
          provider: Yup.string().required('Fornecedor é obrigatório'),
        };

        let schema;

        if (initialData) {
          schema = Yup.object().shape(initialSchema);
        } else {
          schema = Yup.object().shape({
            ...initialSchema,
            quantity: Yup.number().required('Quantidade é obrigatório').min(1),
          });
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        const ajusteData = {
          ...data,
          profitValue: Number((data.saleValue - data.purchaseValue).toFixed(2)),
          saleValue: Number(data.saleValue).toFixed(2),
          purchaseValue: Number(data.purchaseValue).toFixed(2),
          purchase: idPurchase,
        };

        initialData
          ? await productService.updateProduct(initialData.id, ajusteData)
          : await productService.createProduct(ajusteData);

        onClick();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          formRef.current?.setErrors(errors);
        }
      } finally {
        setLoading(false);
      }
    },
    [initialData, onClick, idPurchase],
  );

  const handleClick = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  return (
    <Modal
      opened={openModal}
      onClick={handleClick}
      onClose={onClose}
      title={initialData ? 'Editar produto' : 'Adicionar novo produto'}
      loading={loading}
      labelCloseButton="Cancelar"
      labelSaveButton={initialData ? 'Salvar' : 'Adicionar'}>
      <Form
        ref={formRef}
        onSubmit={handleOnSubmit}
        initialData={{
          ...initialData,
          seller: initialData?.seller?.id || '',
          provider: initialData?.provider.id,
        }}>
        <Grid container spacing={3}>
          <Grid item xs={initialData ? 12 : 9}>
            <TextField name="description" label="Descrição" />
          </Grid>

          {!initialData && (
            <Grid item xs={3}>
              <TextField name="quantity" label="Quantidade" type="number" />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField name="code" label="Código" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField name="size" label="Tamanho" />
          </Grid>

          <Grid item xs={12}>
            <Typography>Valores</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberFormat name="purchaseValue" label="Compra" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberFormat name="saleValue" label="Venda" />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Select name="provider" label="Fábrica">
              {providers?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Form>
    </Modal>
  );
};
