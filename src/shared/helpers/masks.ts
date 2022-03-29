export const cnpjMask = (str: string | undefined) =>
  str?.replace(/(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/, '$1.$2.$3/$4-$5');

export const cpfMask = (str: string | undefined) =>
  str?.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, '$1.$2.$3-$4');

export const phoneMask = (str: string | undefined) =>
  str?.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');
