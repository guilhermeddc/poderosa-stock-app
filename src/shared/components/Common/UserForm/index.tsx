import React, {useCallback, useRef} from 'react';

import {Divider, Grid} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Button, Form, NumberFormat, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {useAuth} from 'shared/hooks';
import {userService} from 'shared/services/api/user';
import * as Yup from 'yup';

export const UserForm: React.FC = () => {
  const {user, refreshUser} = useAuth();

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
          city: Yup.string().required(),
          uf: Yup.string().required(),
          publicPlace: Yup.string().required(),
          number: Yup.string().required(),
          complement: Yup.string().notRequired(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        user &&
          (await userService.updateUser(user.id, {
            ...user,
            ...data,
            updated: true,
          }));

        await refreshUser();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [refreshUser, user],
  );

  return (
    <Form ref={formRef} onSubmit={handleOnSubmit} initialData={user}>
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
          <Button type="submit" label="Salvar" fullWidth />
        </Grid>
      </Grid>
    </Form>
  );
};
