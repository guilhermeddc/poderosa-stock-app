import React, {useEffect, useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import {useNavigate} from 'react-router-dom';

import {VisibilityRounded} from '@mui/icons-material';
import {Grid, IconButton, Stack, Tooltip, useMediaQuery} from '@mui/material';
import {
  Button,
  DataGrid,
  FilterData,
  InputSearch,
  LinearDeterminate,
  Subtitle,
  Title,
} from 'shared/components';
import {cpfMask, phoneMask} from 'shared/helpers/masks';
import {useTitle} from 'shared/hooks';
import {sellerService} from 'shared/services/api/seller';

export const Sellers: React.FC = () => {
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();
  const {setTitle} = useTitle();
  const matches = useMediaQuery('(min-width:769px)');

  useEffect(() => {
    setTitle('Vendedores');
  }, [setTitle]);

  const {data, isLoading} = useQuery('sellers', () =>
    sellerService.getSellers(),
  );

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

  if (isLoading) {
    return <LinearDeterminate />;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title title="Gestão de vendedores" />
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
                    fullWidth={!matches}
                    onClick={() => setFilter('')}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FilterData>
        </Grid>

        <Grid item xs={12}>
          <Subtitle subtitle="Vendedores" />
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
                    <Tooltip title="Detalhes">
                      <IconButton
                        onClick={() =>
                          navigate(`/vendedores/${params.row.id}`)
                        }>
                        <VisibilityRounded />
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
            rows={filteredData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Sellers;
