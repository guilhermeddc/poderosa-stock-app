import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useQueryClient, useQuery, useMutation} from 'react-query';

import {AddRounded, DeleteRounded, EditRounded} from '@mui/icons-material';
import {Grid, IconButton, Stack, Tooltip, useMediaQuery} from '@mui/material';
import {
  Button,
  DataGrid,
  FilterData,
  InputSearch,
  LinearDeterminate,
  ModalConfirm,
  Subtitle,
  Title,
} from 'shared/components';
import {phoneMask} from 'shared/helpers/masks';
import {useTitle} from 'shared/hooks';
import {feedback} from 'shared/services/alertService';
import {IProvider, providerService} from 'shared/services/api/provider';

import {ModalProvider} from './ModalProvider';

export const Providers: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [provider, setProvider] = useState<IProvider | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const matches = useMediaQuery('(min-width:769px)');
  const queryClient = useQueryClient();
  const {setTitle} = useTitle();

  useEffect(() => {
    setTitle('Fornecedores');
  }, [setTitle]);

  const {data, isLoading} = useQuery('providers', () =>
    providerService.getProviders(),
  );

  const mutation = useMutation(
    () => providerService.deleteProvider(idDeleted),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('providers');
        setIdDeleted('');
        setOpenModalConfirmExclude(false);
        feedback('Registro excluído com sucesso', 'success');
      },
      onError: () => {
        setIdDeleted('');
        setOpenModalConfirmExclude(false);
        feedback('Erro ao excluir registro', 'error');
      },
    },
  );

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
    queryClient.invalidateQueries('providers');
  }, [queryClient]);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setIdDeleted(id);
  }, []);

  const filteredData = useMemo(() => {
    if (data) {
      return data.filter(
        (item) =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.shopping.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    return [];
  }, [data, filter]);

  if (isLoading) {
    return <LinearDeterminate />;
  }

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
              label="Adicionar novo"
              startIcon={<AddRounded />}
              variant="outlined"
              onClick={() => setOpenModal(true)}
              disabled={isLoading}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FilterData>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputSearch
                  placeholder="Pesquisar por nome ou Shopping..."
                  value={filter}
                  onChange={({target}) => setFilter(target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    label="Limpar filtros"
                    minWidth={180}
                    onClick={() => setFilter('')}
                  />
                </Stack>
              </Grid>
            </Grid>
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
                disableColumnMenu: true,
                disableReorder: true,
                disableExport: true,
                sortable: false,
                renderCell: (params) => (
                  <>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditModal(params.row)}>
                        <EditRounded color="action" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Deletar">
                      <IconButton onClick={() => handleDelete(params.row.id)}>
                        <DeleteRounded color="error" />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              },
              {
                field: 'name',
                headerName: 'Nome',
                minWidth: 250,
                flex: 2,
              },
              {
                field: 'phone',
                headerName: 'Telefone',
                minWidth: 130,
                renderCell: (params) => phoneMask(params.row.phone),
                flex: 1,
              },
              {
                field: 'sellerProvider',
                headerName: 'Vendedora da loja',
                minWidth: 200,
                flex: 1,
              },
              {
                field: 'shopping',
                headerName: 'Shopping',
                minWidth: 200,
                flex: 1,
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
        onClick={mutation.mutate}
        onClose={() => {
          setOpenModalConfirmExclude(false), setIdDeleted('');
        }}
        loading={mutation.isLoading}
      />
    </>
  );
};

export default Providers;
