export const userType = (type: string[]) =>
  type
    .join(', ')
    .replace(/,/g, ', ')
    .replace('admin', 'Administrador')
    .replace('seller', 'Vendedor')
    .replace('customer', 'Cliente');
