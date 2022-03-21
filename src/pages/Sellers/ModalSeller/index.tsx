import React, {useCallback, useRef} from 'react';

import {Grid} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {ISeller, sellerService} from 'shared/services/api/seller';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClick(): void;
  onClose(): void;
  initialData?: ISeller;
}

export const ModalSeller: React.FC<IProps> = ({
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
          cpf: Yup.string().required(),
          phone: Yup.string().required(),
          email: Yup.string().required().email(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (initialData) await sellerService.updateSeller(initialData.id, data);
        else await sellerService.createSeller(data);

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
        <Grid container spacing={2}>
          <Grid item xs={12} />
          <Grid item xs={12}>
            <TextField name="name" label="Nome" />
          </Grid>

          <Grid item xs={12}>
            <TextField name="email" label="E-mail" />
          </Grid>

          <Grid item xs={6}>
            <NumberFormat
              fullWidth
              name="cpf"
              label="CPF"
              prefix=""
              format="###.###.###-##"
            />
          </Grid>

          <Grid item xs={6}>
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
