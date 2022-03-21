import React from 'react';

import {Paper} from '@mui/material';
import {
  DataGrid as MuiDataGrid,
  GridColDef,
  DataGridProps,
  GridLocaleText,
} from '@mui/x-data-grid';

interface IProps extends DataGridProps {
  columns: GridColDef[];
  rows: any[];
  pageSize?: number;
  checkboxSelection?: boolean;
}

const localizedTextsMap: Partial<GridLocaleText> | undefined = {
  columnMenuUnsort: 'não classificado',
  columnMenuSortAsc: 'Classificar por ordem crescente',
  columnMenuSortDesc: 'Classificar por ordem decrescente',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar',
  columnMenuShowColumns: 'Mostrar colunas',
  footerRowSelected: (count: number) => `${count} linhas selecionadas`,
  columnHeaderFiltersLabel: 'Colunas',
  columnsPanelTextFieldLabel: 'Colunas',
  filterOperatorContains: 'contém',
  filterOperatorEquals: 'igual',
  filterOperatorAfter: 'depois de',
  filterOperatorBefore: 'antes de',
  filterOperatorStartsWith: 'começar com',
  filterOperatorEndsWith: 'terminar com',
  filterOperatorIs: 'é',
  filterOperatorIsAnyOf: 'é qualquer um de',
  filterOperatorIsEmpty: 'vazio',
  filterOperatorIsNotEmpty: 'não está vazio',
  filterOperatorNot: 'não',
  filterOperatorOnOrAfter: 'em ou depois de',
  filterOperatorOnOrBefore: 'em ou antes de',
  filterPanelAddFilter: 'adicionar filtro',
  filterPanelColumns: 'Colunas',
  filterPanelOperators: 'Operadores',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Filtrar valor',
  noRowsLabel: 'Nenhum registro encontrado...',
};

export const DataGrid: React.FC<IProps> = ({
  rows,
  columns,
  pageSize = 5,
  checkboxSelection = false,
  ...rest
}) => {
  return (
    <Paper>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        autoHeight
        localeText={localizedTextsMap}
        {...rest}
      />
    </Paper>
  );
};
