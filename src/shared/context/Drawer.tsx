import React, {useState, createContext, useEffect} from 'react';

import {adminMenu, sellerMenu} from 'shared/constants';
import {useAuth} from 'shared/hooks';

export interface IMenuOptions {
  id: string;
  icon: string;
  label: string;
  subMenu?: IMenuOptions[];
  path?: string;
}

export interface IContextDrawer {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
  menuOptions: IMenuOptions[];
}

export const DrawerContext = createContext<IContextDrawer>(
  {} as IContextDrawer,
);

export const DrawerProvider: React.FC = ({children}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOptions, setMenuOptions] = useState<IMenuOptions[]>([]);

  const {isAdmin, isSeller} = useAuth();

  useEffect(() => {
    if (isAdmin) setMenuOptions(adminMenu);
    else if (isSeller) setMenuOptions(sellerMenu);
  }, [isAdmin, isSeller]);

  return (
    <DrawerContext.Provider value={{drawerOpen, setDrawerOpen, menuOptions}}>
      {children}
    </DrawerContext.Provider>
  );
};
