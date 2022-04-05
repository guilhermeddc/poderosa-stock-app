import React, {useCallback, useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';

import {EditRounded, DeleteRounded} from '@mui/icons-material';
import {Grid, Tooltip, IconButton, Avatar, Stack} from '@mui/material';
import {
  Title,
  FilterData,
  InputSearch,
  Subtitle,
  DataGrid,
  ModalConfirm,
  Button,
} from 'shared/components';
import {cpfMask, phoneMask} from 'shared/helpers/masks';
import {userType} from 'shared/helpers/userType';
import {feedback} from 'shared/services/alertService';
import {IUser, userService} from 'shared/services/api/user';

import {ModalUser} from './components/ModalUser';

const Users: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState<IUser | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const queryClient = useQueryClient();

  const {data} = useQuery('users', () => userService.getUsers());

  const mutation = useMutation(() => userService.deleteUser(idDeleted), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setIdDeleted('');
      setOpenModalConfirmExclude(false);
      feedback('Registro excluído com sucesso', 'success');
    },
    onError: () => {
      setIdDeleted('');
      setOpenModalConfirmExclude(false);
      feedback('Erro ao excluir registro', 'error');
    },
  });

  const handleEditModal = useCallback((row: IUser) => {
    setUser(row);

    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setUser(undefined);

    setOpenModal(false);
  }, []);

  const handleClickModal = useCallback(() => {
    setUser(undefined);

    setOpenModal(false);
    queryClient.invalidateQueries('users');
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
          item.cpf.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    return [];
  }, [data, filter]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title title="Gestão de usuários" />
        </Grid>

        <Grid item xs={12}>
          <FilterData>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputSearch
                  placeholder="Pesquisar por nome ou CPF..."
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
          <Subtitle subtitle="Usuários" />
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
                field: 'imageUrl',
                headerName: 'Imagem',
                width: 75,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => <Avatar src={params.row.imageUrl} />,
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
              {
                field: 'type',
                headerName: 'Tipo',
                minWidth: 280,
                renderCell: (params) => userType(params.row.type),
              },
            ]}
            rows={filteredData || []}
          />
        </Grid>
      </Grid>

      <ModalUser
        openModal={openModal}
        onClick={handleClickModal}
        onClose={handleCloseModal}
        initialData={user}
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

export default Users;
