import React, {useCallback} from 'react';

import {Add} from '@mui/icons-material';
import {Box, Grid, MenuItem, useTheme, Skeleton} from '@mui/material';

import {Button} from '../Button';
import {InputSearch} from '../InputSearch';
import {CssTextField} from './styles';

interface IProps {
  filter?: any;
  onClick?(): void;
  LabelButton?: string;
  inputType?: string;
  loading?: boolean;
  dataFilter?: string[];
  tableFiltered?: number;
  setFilter?(value: any): void;
  setTableFiltered?(value: number): void;
}

export const Header: React.FC<IProps> = ({
  filter,
  onClick,
  children,
  setFilter,
  LabelButton = 'Novo',
  tableFiltered,
  loading = false,
  setTableFiltered,
  inputType = 'text',
  dataFilter = ['TODOS', 'ATIVOS', 'INATIVOS'],
}) => {
  const theme = useTheme();

  const handleTableFiltered = useCallback(
    (event) => {
      const {value} = event.target;
      setTableFiltered && setTableFiltered(value);
    },
    [setTableFiltered],
  );

  const skeleton = () => (
    <>
      <Grid item xs={6}>
        <Skeleton height={36} />
      </Grid>

      <Grid item xs={6}>
        <Box
          display="flex"
          justifyContent="space-between"
          marginLeft={3}
          alignItems="center">
          <Box width={160}>
            <Skeleton height={36} />
          </Box>
          <Box width={160}>
            <Skeleton height={36} />
          </Box>
        </Box>
      </Grid>
    </>
  );

  return loading ? (
    skeleton()
  ) : (
    <>
      <Grid item xs={6}>
        {setFilter && (
          <InputSearch
            type={inputType}
            variant="outlined"
            placeholder="Pesquisar na tabela..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}
      </Grid>

      <Grid item xs={6}>
        <Box
          display="flex"
          justifyContent="space-between"
          marginLeft={3}
          alignItems="center">
          <Box width={160}>
            {setTableFiltered ? (
              <CssTextField
                select
                fullWidth
                variant="outlined"
                value={tableFiltered}
                onChange={handleTableFiltered}
                size="small"
                defaultValue={0}
                style={{
                  padding: 0,
                  margin: 0,
                  color: theme.palette.primary.main,
                }}>
                {dataFilter.map((item, index) => (
                  <MenuItem key={index} value={index}>
                    {item}
                  </MenuItem>
                ))}
              </CssTextField>
            ) : (
              <></>
            )}
          </Box>

          {onClick && (
            <Box minWidth={160} gap={16} display="flex">
              <Button
                fullWidth
                onClick={onClick}
                label={LabelButton}
                startIcon={
                  children ? children : <Add style={{color: '#F8F8F8'}} />
                }
              />
            </Box>
          )}
        </Box>
      </Grid>
    </>
  );
};
