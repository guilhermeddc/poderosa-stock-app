import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {AddRounded, EditRounded, DeleteRounded} from '@mui/icons-material';
import {Grid, Tooltip, IconButton, Avatar} from '@mui/material';
import {
  Title,
  FilterData,
  InputSearch,
  Subtitle,
  DataGrid,
  ModalConfirm,
} from 'shared/components';
import {cpfMask, phoneMask} from 'shared/helpers/masks';
import {feedback} from 'shared/services/alertService';
import {IUser, userService} from 'shared/services/api/user';

import {ModalUser} from './components';

const Users: React.FC = () => {
  const [data, setData] = useState<IUser[]>([]);
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState<IUser | undefined>();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idDeleted, setIdDeleted] = useState('');
  const [openModalConfirmExclude, setOpenModalConfirmExclude] = useState(false);

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await userService.getUsers();

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
    getData();
  }, [getData]);

  const handleDelete = useCallback((id: string) => {
    setOpenModalConfirmExclude(true);

    setIdDeleted(id);
  }, []);

  const handleConfirmDeleted = useCallback(async () => {
    try {
      setLoading(true);
      await userService.deleteUser(idDeleted);

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
            <InputSearch
              placeholder="Pesquisar por nome ou CPF..."
              value={filter}
              onChange={({target}) => setFilter(target.value)}
            />
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
                width: 70,
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
                minWidth: 130,
                renderCell: (params) =>
                  params.row.type === 'seller'
                    ? 'Vendedor'
                    : params.row.type === 'admin'
                    ? 'Admin'
                    : '',
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
        onClick={handleConfirmDeleted}
        onClose={() => {
          setOpenModalConfirmExclude(false), setIdDeleted('');
        }}
        loading={loading}
      />
    </>
  );
};

export default Users;
