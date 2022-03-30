import React from 'react';
import {QueryClientProvider} from 'react-query';

import {CssBaseline, ThemeProvider} from '@mui/material';
import {Routes} from 'routes';
import {AppProvider} from 'shared/context';
import {queryClient} from 'shared/services/queryClient';
import {theme} from 'shared/theme';
import 'shared/services/translationYup';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider>
          <Routes />
          <CssBaseline />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
