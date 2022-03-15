import React, {useCallback, useState} from 'react';

import {Box, Container, useTheme} from '@mui/material';
import {useDrawer} from 'shared/hooks';

import {AppBar, Drawer, AlertComponent} from './components';

export const BaseLayout: React.FC = ({children}) => {
  const [buttonActive, setButtonActive] = useState(false);

  const {drawerOpen, setDrawerOpen, menuOptions} = useDrawer();
  const theme = useTheme();

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar
        handleDrawerOpen={handleDrawerOpen}
        drawerOpen={drawerOpen}
        buttonActive={buttonActive}
        setButtonActive={setButtonActive}
      />

      <Drawer
        menuOptions={menuOptions}
        drawerOpen={drawerOpen}
        onMouseEnter={() => setDrawerOpen(true)}
        onMouseLeave={() => setDrawerOpen(false)}
        buttonActive={buttonActive}
      />

      <main style={{flexGrow: 1, margin: theme.spacing(12, 0)}}>
        <Container maxWidth="lg">{children}</Container>
      </main>

      <AlertComponent />
    </Box>
  );
};
