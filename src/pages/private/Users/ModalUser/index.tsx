import React, {useCallback, useRef, useState} from 'react';

import {Divider, Grid, MenuItem} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, Select, TextField} from 'shared/components';
import {userId} from 'shared/constants';
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
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const handleOnSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          cpf: Yup.string().required(),
          phone: Yup.string().required(),
          email: Yup.string().required().email(),
          city: Yup.string().required(),
          uf: Yup.string().required(),
          publicPlace: Yup.string().required(),
          number: Yup.string().required(),
          complement: Yup.string().notRequired(),
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
      } finally {
        setIsLoading(false);
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
      loading={isLoading}
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
            <Divider />
          </Grid>

          <Grid item xs={8}>
            <TextField name="city" label="Cidade" />
          </Grid>

          <Grid item xs={4}>
            <TextField name="uf" label="UF" />
          </Grid>

          <Grid item xs={8}>
            <TextField name="publicPlace" label="Logradouro" />
          </Grid>

          <Grid item xs={4}>
            <TextField name="number" label="Número" />
          </Grid>

          <Grid item xs={12}>
            <TextField name="complement" label="Complemento" />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Select name="type" label="Tipo de usuário" multiple>
              <MenuItem value="" disabled defaultChecked>
                Selecione uma opção
              </MenuItem>
              <MenuItem value={userId.admin}>Administrador</MenuItem>
              <MenuItem value={userId.seller}>Vendedor</MenuItem>
              <MenuItem value={userId.customer}>Cliente</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Form>
    </Modal>
  );
};
