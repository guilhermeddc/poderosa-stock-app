import React, {useCallback, useEffect, useState} from 'react';

import {AddRounded, DeleteRounded, EditRounded} from '@mui/icons-material';
import {Grid, IconButton, Stack, Tooltip, Typography} from '@mui/material';
import {Button, DataGrid, FilterData, ModalConfirm} from 'shared/components';
import {cpfMask, phoneMask} from 'shared/helpers/masks';
import {feedback} from 'shared/services/alertService';
import {ISeller, sellerService} from 'shared/services/api/seller';

import {ModalSeller} from './ModalSeller';

export const Sellers: React.FC = () => {
  const [data, setData] = useState<ISeller[]>([]);
  const [seller, setSeller] = useState<ISeller | undefined>();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await sellerService.getSellers();

      setData(response);
    } catch (error) {
      feedback('Erro ao carregar os dados', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleEditModal = useCallback((row: ISeller) => {
    setSeller(row);

    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSeller(undefined);

    setOpenModal(false);
  }, []);

  const handleClickModal = useCallback(() => {
    setSeller(undefined);

    setOpenModal(false);
    getData();
  }, [getData]);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setIdDeleted(id);
  }, []);

  const handleConfirmDeleted = useCallback(async () => {
    try {
      setLoading(true);
      await sellerService.deleteSeller(idDeleted);

      await getData();

      feedback('Registro excluído com sucesso', 'success');
    } catch (error) {
      feedback('Erro ao tentar excluir', 'error');
    }
    setLoading(false);
    setIdDeleted('');
    setOpenModalConfirmExclude(false);
  }, [getData, idDeleted]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={400} variant="h4" color="primary">
              Gestão de vendedores
            </Typography>

            <Button
              label="Adicionar nova"
              startIcon={<AddRounded />}
              variant="outlined"
              onClick={() => setOpenModal(true)}
              disabled={loading}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FilterData />
        </Grid>

        <Grid item xs={12}>
          <Typography
            fontWeight={400}
            variant="h6"
            textTransform="uppercase"
            color="primary">
            Vendedores
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            columns={[
              {
                field: 'acoes',
                headerName: 'Ações',
                align: 'center',
                headerAlign: 'center',
                minWidth: 150,
                renderCell: (params) => (
                  <>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditModal(params.row)}>
                        <EditRounded color="primary" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Deletar">
                      <IconButton onClick={() => handleDelete(params.row.id)}>
                        <DeleteRounded color="primary" />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              },
              {
                field: 'name',
                headerName: 'Nome',
                minWidth: 250,
              },
              {
                field: 'email',
                headerName: 'E-mail',
                minWidth: 200,
              },
              {
                field: 'cpf',
                headerName: 'CPF',
                minWidth: 200,
                renderCell: (params) => cpfMask(params.row.cpf),
              },
              {
                field: 'phone',
                headerName: 'Telefone',
                minWidth: 130,
                renderCell: (params) => phoneMask(params.row.phone),
              },
            ]}
            rows={data}
          />
        </Grid>
      </Grid>

      <ModalSeller
        openModal={openModal}
        onClick={handleClickModal}
        onClose={handleCloseModal}
        initialData={seller}
      />

      <ModalConfirm
        opened={openModalConfirmExclude}
        onClick={handleConfirmDeleted}
        onClose={() => {
          setOpenModalConfirmExclude(false), setIdDeleted('');
        }}
        loading={loading}
      />
    </>
  );
};

export default Sellers;
