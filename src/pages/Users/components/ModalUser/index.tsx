import React, {useCallback, useRef} from 'react';

import {Grid, MenuItem} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, Select, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {IUser, userService} from 'shared/services/api/user';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClick(): void;
  onClose(): void;
  initialData?: IUser;
}

export const ModalUser: React.FC<IProps> = ({
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

        initialData &&
          (await userService.updateUser(initialData.id, {
            ...initialData,
            ...data,
          }));

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
      title="Editar usuário"
      labelCloseButton="Fechar"
      labelSaveButton="Salvar">
      <Form ref={formRef} onSubmit={handleOnSubmit} initialData={initialData}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField name="name" label="Nome" disabled />
          </Grid>

          <Grid item xs={12}>
            <TextField name="email" label="E-mail" disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NumberFormat
              fullWidth
              name="cpf"
              label="CPF"
              prefix=""
              format="###.###.###-##"
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

          <Grid item xs={12}>
            <Select name="type" label="Tipo de usuário" multiple>
              <MenuItem value="" disabled defaultChecked>
                Selecione uma opção
              </MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="seller">Vendedor</MenuItem>
              <MenuItem value="consumer">Cliente</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Form>
    </Modal>
  );
};
