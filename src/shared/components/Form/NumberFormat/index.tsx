import React, {useEffect, useState} from 'react';
import MuiNumberFormat, {NumberFormatProps} from 'react-number-format';

import {TextField, TextFieldProps, Skeleton} from '@mui/material';
import {useField} from '@unform/core';

type TVTextFieldProps = Omit<NumberFormatProps, 'value'> &
  Omit<TextFieldProps, 'value'> & {
    name: string;
    isLoading?: boolean | undefined;
    skeletonWidth?: number | undefined;
    skeletonHeight?: number | undefined;

    onValueChange?: (value: string) => void;
  };
/**
 * - Para resgatar o valor numérico no correto use o `onValueChange`
 * - Para eventos normais use o `onChange`
 *
 * Para como customizar a formatação verifique a documentação original do `react-number-format` [nesse link](https://www.npmjs.com/package/react-number-format)
 */
export const NumberFormat: React.FC<TVTextFieldProps> = ({
  name,
  isLoading,
  skeletonWidth,
  skeletonHeight = 70,
  onValueChange,
  ...rest
}) => {
  const {fieldName, defaultValue, registerField, error} = useField(name);
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, value) => setValue(value),
    });
  }, [fieldName, value, registerField]);

  const handleChange = (value: string) => {
    setValue(value);
    onValueChange && onValueChange(value);
  };

  if (isLoading)
    return <Skeleton height={skeletonHeight} width={skeletonWidth} />;

  return (
    <MuiNumberFormat
      {...(rest as any)}
      prefix={rest.prefix || 'R$ '}
      decimalScale={rest.decimalScale || 2}
      isNumericString={rest.isNumericString || true}
      decimalSeparator={rest.decimalSeparator || ','}
      thousandSeparator={rest.thousandSeparator || '.'}
      fixedDecimalScale={rest.fixedDecimalScale || true}
      customInput={TextField}
      value={value}
      error={!!error}
      helperText={error}
      onValueChange={({value}) => handleChange(value)}
      style={{minWidth: '100%'}}
    />
  );
};
