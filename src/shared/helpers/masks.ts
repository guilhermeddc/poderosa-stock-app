export const cnpjMask = (str: string | undefined) =>
  str?.replace(/(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/, '$1.$2.$3/$4-$5');

export const cpfMask = (str: string | undefined) =>
  str?.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, '$1.$2.$3-$4');

export const phoneMask = (str: string | undefined) =>
  str?.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');

export const moneyMask = (num: number | undefined) =>
  num?.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

export const dateMask = (str: string | undefined) =>
  str?.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');

export const cepMask = (str: string | undefined) =>
  str?.replace(/(\d{5})(\d{3})/, '$1-$2');

export const strUnmask = (str: string | undefined) =>
  str?.replace(/[^\d]+/g, '');
