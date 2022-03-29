import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {VisibilityRounded} from '@mui/icons-material';
import {Grid, IconButton, Tooltip} from '@mui/material';
import {
  DataGrid,
  FilterData,
  InputSearch,
  Subtitle,
  Title,
} from 'shared/components';
import {cpfMask, phoneMask} from 'shared/helpers/masks';
import {feedback} from 'shared/services/alertService';
import {ISeller, sellerService} from 'shared/services/api/seller';

export const Sellers: React.FC = () => {
  const [data, setData] = useState<ISeller[]>([]);
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();

  const getData = useCallback(async () => {
    try {
      const response = await sellerService.getSellers();

      setData(response);
    } catch (error) {
      feedback('Erro ao carregar os dados', 'error');
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

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
          <Title title="Gestão de vendedores" />
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
                renderCell: (params) => (
                  <>
                    <Tooltip title="Detalhes">
                      <IconButton
                        onClick={() =>
                          navigate(`/vendedores/${params.row.id}`)
                        }>
                        <VisibilityRounded color="primary" />
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
