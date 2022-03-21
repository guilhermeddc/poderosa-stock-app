import React from 'react';

import {CssBaseline, ThemeProvider} from '@mui/material';
import {Routes} from 'routes';
import {AppProvider} from 'shared/context';
import {theme} from 'shared/theme';
import 'shared/services/translationYup';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Routes />
        <CssBaseline />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
