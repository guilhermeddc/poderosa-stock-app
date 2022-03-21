import React, {useState, createContext, useEffect} from 'react';

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

  useEffect(() => {
    setMenuOptions([
      {
        id: 'home',
        label: 'Início',
        icon: 'home',
        path: '/',
      },
      {
        id: 'products',
        label: 'Produtos',
        icon: 'shopping_bag',
        path: '/produtos',
      },
      // {
      //   id: 'purchases',
      //   label: 'Compras',
      //   icon: 'attach_money',
      //   path: '/compras',
      // },
      // {
      //   id: 'sell',
      //   label: 'Vendas',
      //   icon: 'sell',
      //   path: '/vendas',
      // },
      // {
      //   id: 'movements',
      //   label: 'Movimentos',
      //   icon: 'currency_exchange',
      //   path: '/movimentos',
      // },
      {
        id: 'providers',
        label: 'Fornecedores',
        icon: 'integration_instructions',
        path: '/fornecedores',
      },
      // {
      //   id: 'clients',
      //   label: 'Clientes',
      //   icon: 'assignment_ind',
      //   path: '/clientes',
      // },
      {
        id: 'salesman',
        label: 'Vendedores',
        icon: 'assignment_turned_in',
        path: '/vendedores',
      },
    ]);
  }, []);

  return (
    <DrawerContext.Provider value={{drawerOpen, setDrawerOpen, menuOptions}}>
      {children}
    </DrawerContext.Provider>
  );
};
