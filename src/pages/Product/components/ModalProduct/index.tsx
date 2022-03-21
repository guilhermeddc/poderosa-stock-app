import React, {useCallback, useRef} from 'react';

import {Grid, Typography} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClick(): void;
  onClose(): void;
}

export const ModalProduct: React.FC<IProps> = ({
  openModal,
  onClick,
  onClose,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleOnSubmit = useCallback(async (data) => {
    try {
      formRef.current?.setErrors({});

      // eslint-disable-next-line
      console.log('*** data', data);

      const schema = Yup.object().shape({});

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err as Yup.ValidationError);
        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  const handleClick = useCallback(() => {
    formRef.current?.submitForm();

    onClick();
  }, [onClick]);

  return (
    <Modal
      opened={openModal}
      onClick={handleClick}
      onClose={onClose}
      title="Adicionar novo Produto"
      labelCloseButton="Fechar"
      labelSaveButton="Adicionar">
      <Form ref={formRef} onSubmit={handleOnSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField name="description" label="Descrição" required />
          </Grid>

          <Grid item xs={3}>
            <TextField name="size" label="Tamanho" required />
          </Grid>

          <Grid item xs={12}>
            <Typography>Valores</Typography>
          </Grid>

          <Grid item xs={4}>
            <NumberFormat name="purchaseValue" label="Compra" required />
          </Grid>
          <Grid item xs={4}>
            <NumberFormat name="saleValue" label="Venda" required />
          </Grid>
          <Grid item xs={4}>
            <NumberFormat name="profitValue" label="Lucro" required />
          </Grid>
        </Grid>
      </Form>
    </Modal>
  );
};
