export const renderNumber = (num: number) =>
  `R$ ${String(num.toFixed(2)).replace('.', ',')}`;
