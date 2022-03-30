export const userId = {
  admin: process.env.REACT_APP_ADMIN_ID as string,
  seller: process.env.REACT_APP_SELLER_ID as string,
  customer: process.env.REACT_APP_CUSTOMER_ID as string,
};

export const adminMenu = [
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
  {
    id: 'users',
    label: 'Usuários',
    icon: 'people',
    path: '/usuarios',
  },
];

export const sellerMenu = [
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
];
