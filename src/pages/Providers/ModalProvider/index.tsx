import React, {useCallback, useRef} from 'react';

import {Grid} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {IProvider, providerService} from 'shared/services/api/provider';
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

  const handleOnSubmit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          cnpj: Yup.string().required(),
          phone: Yup.string().required(),
          email: Yup.string().required().email(),
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
      title={initialData ? 'Editar vendedor(a)' : 'Adicionar nova vendedor(a)'}
      labelCloseButton="Fechar"
      labelSaveButton="Salvar">
      <Form ref={formRef} onSubmit={handleOnSubmit} initialData={initialData}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField name="name" label="Nome" />
          </Grid>

          <Grid item xs={12}>
            <TextField name="email" label="E-mail" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberFormat
              fullWidth
              name="cnpj"
              label="CNPJ"
              prefix=""
              format="##.###.###/####-##"
            />
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
        </Grid>
      </Form>
    </Modal>
  );
};
