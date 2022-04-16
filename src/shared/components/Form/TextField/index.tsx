import React, {useEffect, useState} from 'react';

import {
  TextField as MuiTextField,
  TextFieldProps,
  Skeleton,
} from '@mui/material';
import {useField} from '@unform/core';

type TVTextFieldProps = Omit<TextFieldProps, 'value'> & {
  name: string;
  helper?: string;
  isLoading?: boolean | undefined;
  skeletonWidth?: number | undefined;
  skeletonHeight?: number | undefined;
  auxValue?: string | number | Date;
  setAuxValue?: (value: string | number | Date) => void;
};
export const TextField: React.FC<TVTextFieldProps> = ({
  name,
  helper,
  isLoading,
  skeletonWidth,
  skeletonHeight = 70,
  auxValue,
  setAuxValue,
  onChange,
  ...rest
}) => {
  const {fieldName, defaultValue, registerField, error} = useField(name);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    auxValue && setValue(auxValue);
  }, [auxValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, value) => setValue(value),
    });
  }, [fieldName, value, registerField]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    value: string,
  ) => {
    setValue(value);
    setAuxValue && setAuxValue(value);
    onChange && onChange(event);
  };

  if (isLoading)
    return <Skeleton height={skeletonHeight} width={skeletonWidth} />;

  return (
    <MuiTextField
      value={value}
      fullWidth
      error={!!error}
      variant="outlined"
      onChange={(e) => handleChange(e, e.target.value)}
      helperText={(!!error && error) || helper}
      {...rest}
    />
  );
};
