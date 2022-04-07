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
import {useTitle} from 'shared/hooks';
import {feedback} from 'shared/services/alertService';
import {shoppingService, IShopping} from 'shared/services/api/shopping';

import {ModalShopping} from './ModalShopping';

export const Shoppings: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [shopping, setShopping] = useState<IShopping | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const matches = useMediaQuery('(min-width:769px)');
  const queryClient = useQueryClient();
  const {setTitle} = useTitle();

  useEffect(() => {
    setTitle('Shoppings');
  }, [setTitle]);

  const {data, isLoading} = useQuery('shoppings', () =>
    shoppingService.getShoppings(),
  );

  const mutation = useMutation(
    () => shoppingService.deleteShopping(idDeleted),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('shoppings');
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

  const handleEditModal = useCallback((row: IShopping) => {
    setShopping(row);

    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShopping(undefined);

    setOpenModal(false);
  }, []);

  const handleClickModal = useCallback(() => {
    setShopping(undefined);

    setOpenModal(false);
    queryClient.invalidateQueries('shoppings');
  }, [queryClient]);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setIdDeleted(id);
  }, []);

  const filteredData = useMemo(() => {
    if (data) {
      return data.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()),
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
          <Title title="Gestão de shoppings" />
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
                  placeholder="Pesquisar por nome..."
                  value={filter}
                  onChange={({target}) => setFilter(target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    label="Limpar filtros"
                    minWidth={180}
                    fullWidth={!matches}
                    onClick={() => setFilter('')}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FilterData>
        </Grid>

        <Grid item xs={12}>
          <Subtitle subtitle="Shoppings" />
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
              },
              {
                field: 'city',
                headerName: 'Cidade',
                minWidth: 200,
              },
              {
                field: 'uf',
                headerName: 'UF',
                minWidth: 100,
              },
            ]}
            rows={filteredData}
          />
        </Grid>
      </Grid>

      <ModalShopping
        openModal={openModal}
        onClick={handleClickModal}
        onClose={handleCloseModal}
        initialData={shopping}
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

export default Shoppings;
