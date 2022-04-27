import React, {Fragment, useCallback, useRef, useState} from 'react';
import {useQuery, useQueryClient} from 'react-query';

import {Divider, Grid, MenuItem, Typography} from '@mui/material';
import {FormHandles} from '@unform/core';
import {Form, Modal, NumberFormat, Select, TextField} from 'shared/components';
import getValidationErrors from 'shared/helpers/getValidationErrors';
import {
  IMovement,
  movementsService,
} from 'shared/services/api/movementsService';
import {providerService} from 'shared/services/api/provider';
import * as Yup from 'yup';

interface IProps {
  openModal: boolean;
  onClose(): void;
  initialData?: any;
}

export const ModalMovement: React.FC<IProps> = ({
  openModal,
  onClose,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [auxMovement, setAuxMovement] = useState({
    movement: 'purchase',
    dividedIn: 1,
    type: '',
    amount: 0,
  });

  const formRef = useRef<FormHandles>(null);
  const queryClient = useQueryClient();

  const {data: movementTypes} = useQuery('movementTypes', () =>
    movementsService.getMovementTypes(),
  );

  const {data: providers} = useQuery('providers', () =>
    providerService.getProviders(),
  );

  const handleClose = useCallback(() => {
    setAuxMovement({
      movement: 'purchase',
      dividedIn: 1,
      type: '',
      amount: 0,
    });

    onClose();
  }, [onClose]);

  const handleOnSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});

        const auxInstallments = [];

        if (data.installments && data.installments.length > 0) {
          for (let i = 0; i < auxMovement.dividedIn; i++) {
            auxInstallments.push({
              amount: Number(data.installments[i].amount),
              date: data.installments[i].date,
              number: data.installments[i].number,
            });
          }
        }

        const ajusteData: IMovement = {
          movement: data.movement,
          type: data.type,
          amount: Number(data.amount),
          dividedIn: data.dividedIn,
          provider: data.provider || '',
          date: data.date || '',
          installments: auxInstallments || [],
        };

        await movementsService.createMovement(ajusteData);

        queryClient.invalidateQueries('movements');

        handleClose();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          formRef.current?.setErrors(errors);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [auxMovement.dividedIn, handleClose, queryClient],
  );

  const handleClick = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  return (
    <Modal
      opened={openModal}
      onClick={handleClick}
      onClose={handleClose}
      title="Adicionar Movimento"
      loading={isLoading}
      labelCloseButton="Cancelar"
      labelSaveButton="Adicionar">
      <Form ref={formRef} onSubmit={handleOnSubmit} initialData={initialData}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Select
              name="movement"
              label="Movimentação"
              auxValue={auxMovement.movement}
              setAuxValue={(value) =>
                setAuxMovement(
                  (state) =>
                    (state = {
                      ...state,
                      movement: value,
                    }),
                )
              }>
              <MenuItem value="">Selecione</MenuItem>
              <MenuItem value="sale">Entrada</MenuItem>
              <MenuItem value="purchase">Saída</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={6}>
            <Select
              name="type"
              label="Tipo de movimentação"
              setAuxValue={(value) =>
                setAuxMovement((state) => (state = {...state, type: value}))
              }>
              <MenuItem value="">Selecione</MenuItem>
              {movementTypes?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {auxMovement.movement === 'purchase' && (
            <Grid item xs={5}>
              <Select name="provider" label="Loja">
                <MenuItem value="">Selecione</MenuItem>
                {providers?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          )}

          <Grid item xs={12} sm={auxMovement.movement === 'purchase' ? 5 : 6}>
            <NumberFormat
              name="amount"
              label="Valor total"
              setAuxValue={(value) =>
                setAuxMovement((state) => (state = {...state, amount: value}))
              }
            />
          </Grid>

          {auxMovement.movement === 'sale' && (
            <Grid item xs={6}>
              <TextField
                name="date"
                label="Data"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          )}

          {auxMovement.movement === 'purchase' && (
            <Grid item xs={2}>
              <TextField
                name="dividedIn"
                label="Dividido em"
                type="number"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: 1,
                  max: 12,
                }}
                auxValue={auxMovement.dividedIn}
                setAuxValue={(value) =>
                  setAuxMovement(
                    (state) => (state = {...state, dividedIn: Number(value)}),
                  )
                }
              />
            </Grid>
          )}

          {auxMovement.movement === 'purchase' && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography>Parcelas</Typography>
              </Grid>

              {auxMovement.dividedIn >= 1 &&
                Array.from(Array(auxMovement.dividedIn).keys()).map(
                  (_, index) => (
                    <Fragment key={index}>
                      <Grid item xs={4}>
                        <TextField
                          name={`installments[${index}].number`}
                          label="Cheque Nº"
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          name={`installments[${index}].date`}
                          label="Data"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <NumberFormat
                          name={`installments[${index}].amount`}
                          label="Valor"
                          auxValue={auxMovement.amount / auxMovement.dividedIn}
                        />
                      </Grid>
                    </Fragment>
                  ),
                )}
            </>
          )}
        </Grid>
      </Form>
    </Modal>
  );
};
