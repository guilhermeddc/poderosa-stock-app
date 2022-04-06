import React, {useCallback, useRef} from 'react';
import {useQuery} from 'react-query';

import {Grid, MenuItem} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, Select, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {IProvider, providerService} from 'shared/services/api/provider';
import {shoppingService} from 'shared/services/api/shopping';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClick(): void;
  onClose(): void;
  initialData?: IProvider;
}

export const ModalProvider: React.FC<IProps> = ({
  openModal,
  onClick,
  onClose,
  initialData,
}) => {
  const formRef = useRef<FormHandles>(null);

  const {data: shoppings} = useQuery('shoppings', () =>
    shoppingService.getShoppings(),
  );

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          shopping: Yup.string().required(),
          phone: Yup.string().required(),
          sellerProvider: Yup.string().required().email(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (initialData)
          await providerService.updateProvider(initialData.id, data);
        else await providerService.createProvider(data);

        onClick();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [initialData, onClick],
  );

  const handleClick = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  return (
    <Modal
      opened={openModal}
      onClick={handleClick}
      onClose={onClose}
      title={initialData ? 'Editar shopping' : 'Adicionar novo shopping'}
      labelCloseButton="Fechar"
      labelSaveButton="Salvar">
      <Form ref={formRef} onSubmit={handleOnSubmit} initialData={initialData}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField name="name" label="Nome da loja" />
          </Grid>

          <Grid item xs={12}>
            <TextField name="sellerProvider" label="Vendedora da loja" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberFormat
              fullWidth
              name="phone"
              label="Telefone"
              prefix=""
              format="(##) #####-####"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Select name="shopping" label="Shopping">
              <MenuItem value="">Selecione</MenuItem>
              {shoppings?.map((shopping) => (
                <MenuItem key={shopping.id} value={shopping.id}>
                  {shopping.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Form>
    </Modal>
  );
};
