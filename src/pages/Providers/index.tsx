import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {AddRounded, DeleteRounded, EditRounded} from '@mui/icons-material';
import {Grid, IconButton, Stack, Tooltip, useMediaQuery} from '@mui/material';
import {
  Button,
  DataGrid,
  FilterData,
  InputSearch,
  ModalConfirm,
  Subtitle,
  Title,
} from 'shared/components';
import {cnpjMask, phoneMask} from 'shared/helpers/masks';
import {feedback} from 'shared/services/alertService';
import {IProvider, providerService} from 'shared/services/api/provider';

import {ModalProvider} from './ModalProvider';

export const Providers: React.FC = () => {
  const [data, setData] = useState<IProvider[]>([]);
  const [filter, setFilter] = useState('');
  const [provider, setProvider] = useState<IProvider | undefined>();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const matches = useMediaQuery('(min-width:600px)');

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await providerService.getProviders();

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

  const handleEditModal = useCallback((row: IProvider) => {
    setProvider(row);

    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setProvider(undefined);

    setOpenModal(false);
  }, []);

  const handleClickModal = useCallback(() => {
    setProvider(undefined);

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
      await providerService.deleteProvider(idDeleted);

      await getData();

      feedback('Registro excluído com sucesso', 'success');
    } catch (error) {
      feedback('Erro ao tentar excluir', 'error');
    }
    setLoading(false);
    setIdDeleted('');
    setOpenModalConfirmExclude(false);
  }, [getData, idDeleted]);

  const filteredData = useMemo(() => {
    if (data) {
      return data.filter(
        (item) =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.cnpj.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    return [];
  }, [data, filter]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Title title="Gestão de fornecedores" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              fullWidth={!matches}
              label="Adicionar"
              startIcon={<AddRounded />}
              variant="outlined"
              onClick={() => setOpenModal(true)}
              disabled={loading}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FilterData>
            <InputSearch
              placeholder="Pesquisar por nome ou CNPJ..."
              value={filter}
              onChange={({target}) => setFilter(target.value)}
            />
          </FilterData>
        </Grid>

        <Grid item xs={12}>
          <Subtitle subtitle="Fornecedores" />
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
                field: 'cnpj',
                headerName: 'CNPJ',
                minWidth: 200,
                renderCell: (params) => cnpjMask(params.row.cnpj),
              },
              {
                field: 'phone',
                headerName: 'Telefone',
                minWidth: 130,
                renderCell: (params) => phoneMask(params.row.phone),
              },
            ]}
            rows={filteredData}
          />
        </Grid>
      </Grid>

      <ModalProvider
        openModal={openModal}
        onClick={handleClickModal}
        onClose={handleCloseModal}
        initialData={provider}
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

export default Providers;
