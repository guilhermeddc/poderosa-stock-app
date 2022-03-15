import {useContext} from 'react';

import {
  DrawerContext,
  DrawerProvider,
  IContextDrawer,
} from 'shared/context/Drawer';

function useDrawer(): IContextDrawer {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within an DrawerProvider');
  }

  return context;
}

export {DrawerProvider, useDrawer};
