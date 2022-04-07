import React, {useCallback, useState} from 'react';

import {Box, Container, Toolbar} from '@mui/material';
import {useDrawer} from 'shared/hooks';

import {AppBar, Drawer, AlertComponent} from './components';

export const PrivateLayout: React.FC = ({children}) => {
  const [buttonActive, setButtonActive] = useState(false);

  const {drawerOpen, setDrawerOpen, menuOptions} = useDrawer();

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

      <Box
        component="main"
        sx={{flexGrow: 2, minHeight: '100vh', py: 3}}
        onClick={() => setDrawerOpen(false)}>
        <Toolbar />
        <Container maxWidth="lg">{children}</Container>
      </Box>

      <AlertComponent />
    </Box>
  );
};
