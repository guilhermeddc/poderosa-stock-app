import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import {useNavigate} from 'react-router-dom';

import {AddRounded, VisibilityRounded} from '@mui/icons-material';
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  Button,
  DataGrid,
  FilterData,
  InputSearch,
  LinearDeterminate,
  Subtitle,
  Title,
} from 'shared/components';
import {moneyMask} from 'shared/helpers/masks';
import {useTitle} from 'shared/hooks';
import {IPurchase, purchaseService} from 'shared/services/api/purchases';

const Purchases: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [purchaseType, setPurchaseType] = useState('');

  const {setTitle} = useTitle();
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width:769px)');

  const {data, isLoading} = useQuery('purchases', () =>
    purchaseService.getPurchases(),
  );

  const {data: purchaseTypes} = useQuery('purchaseTypes', () =>
    purchaseService.getPurchaseTypes(),
  );

  const filteredData = useMemo(() => {
    if (data) {
      const itemFiltered = (item: IPurchase) =>
        item.name.toLowerCase().includes(filter.toLowerCase());

      if (purchaseType) {
        return data?.filter(
          (item) => itemFiltered(item) && item.type === purchaseType,
        );
      }

      return data?.filter((item) => itemFiltered(item));
    }
    return [];
  }, [data, filter, purchaseType]);

  const handleResetFilter = useCallback(() => {
    setFilter('');
    setPurchaseType('');
  }, []);

  useEffect(() => {
    setTitle('Compras');
  }, [setTitle]);

  if (isLoading) {
    return <LinearDeterminate />;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Title title="Gestão de compras" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              fullWidth={!matches}
              label="Adicionar"
              startIcon={<AddRounded />}
              variant="outlined"
              onClick={() => navigate('/compras/nova')}
              disabled={isLoading}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FilterData>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={9}>
                <InputSearch
                  placeholder="Pesquisar..."
                  value={filter}
                  onChange={({target}) => setFilter(target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="purchaseType">Tipo de compra</InputLabel>
                  <Select
                    label="Tipo de compra"
                    id="purchaseType"
                    labelId="purchaseType"
                    value={purchaseType || ''}
                    onChange={({target}) => setPurchaseType(target.value)}>
                    <MenuItem value="">Todas</MenuItem>
                    {purchaseTypes?.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    label="Limpar filtros"
                    minWidth={180}
                    onClick={handleResetFilter}
                  />
                </Stack>
              </Grid>
            </Grid>
          </FilterData>
        </Grid>

        <Grid item xs={12}>
          <Subtitle subtitle="Compras" />
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
                renderCell: () => (
                  <>
                    <Tooltip title="Detalhes">
                      <IconButton>
                        <VisibilityRounded color="primary" />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              },
              {
                field: 'name',
                headerName: 'Nome',
                flex: 2,
              },
              {
                field: 'quantity',
                headerName: 'Quantidade',
                flex: 0.5,
              },
              {
                field: 'purchaseValue',
                headerName: 'Valor compra',
                flex: 1,
                renderCell: (params) => moneyMask(params.row.purchaseValue),
              },
              {
                field: 'saleValue',
                headerName: 'Valor venda',
                flex: 1,
                renderCell: (params) => moneyMask(params.row.saleValue),
              },
              {
                field: 'profitValue',
                headerName: 'Valor lucro',
                flex: 1,
                renderCell: (params) => moneyMask(params.row.profitValue),
              },
              {
                field: 'type',
                flex: 1,
                headerName: 'Tipo de compra',
              },
            ]}
            rows={filteredData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Purchases;
