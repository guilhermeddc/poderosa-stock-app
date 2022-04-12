import React, {useCallback, useRef, useState} from 'react';

import {Grid, useMediaQuery} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {IShopping, shoppingService} from 'shared/services/api/shopping';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClick(): void;
  onClose(): void;
  initialData?: IShopping;
}

export const ModalShopping: React.FC<IProps> = ({
  openModal,
  onClick,
  onClose,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const matches = useMediaQuery('(min-width:769px)');

  const handleOnSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          city: Yup.string().required(),
          uf: Yup.string().required(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (initialData)
          await shoppingService.updateShopping(initialData.id, data);
        else await shoppingService.createShopping(data);

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
      loading={isLoading}
      title={initialData ? 'Editar shopping' : 'Adicionar novo shopping'}
      labelCloseButton="Fechar"
      labelSaveButton="Salvar">
      <Form ref={formRef} onSubmit={handleOnSubmit} initialData={initialData}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField name="name" label="Nome" />
          </Grid>

          <Grid item xs={matches ? 10 : 8}>
            <TextField name="city" label="Cidade" />
          </Grid>

          <Grid item xs={matches ? 2 : 4}>
            <TextField name="uf" label="UF" />
          </Grid>
        </Grid>
      </Form>
    </Modal>
  );
};
