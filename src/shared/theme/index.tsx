import {createTheme} from '@mui/material';
import {ptBR} from '@mui/material/locale';

export const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#0d47a1',
        light: '#5472d3',
        dark: '#002171',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#64b5f6 ',
        light: '#9be7ff',
        dark: '#2286c3',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#F50000',
        light: '#F73333',
        dark: '#AB0000',
      },
      warning: {
        main: '#FFAC33',
        light: '#FF9800',
        dark: '#B26A00',
      },
      success: {
        main: '#33B673',
        light: '#00A451',
        dark: '#007238',
      },
      info: {
        main: '#018781',
        light: '#339F9A',
        dark: '#005E5A',
      },
      text: {
        primary: '#414141',
      },
      background: {
        default: '#F8F8F8',
        paper: '#FFFFFF',
      },
    },
  },
  ptBR,
);
