import {userId} from 'shared/constants';

export const userType = (type: string[]) =>
  type
    .join(', ')
    .replace(/,/g, ', ')
    .replace(userId.admin, 'Administrador')
    .replace(userId.seller, 'Vendedor')
    .replace(userId.customer, 'Cliente');
