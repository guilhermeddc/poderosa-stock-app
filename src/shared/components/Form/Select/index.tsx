import React, {useEffect, useRef, useState} from 'react';

import {
  Select as MuiSelect,
  SelectProps,
  FormHelperText,
  Skeleton,
  FormControl,
  InputLabel,
} from '@mui/material';
import {useField} from '@unform/core';

type TVSelectProps = Omit<SelectProps, 'value'> & {
  name: string;
  label: string;
  helper?: string;
  isLoading?: boolean;
  skeletonWidth?: number;
  skeletonHeight?: number;
  auxValue?: string;
  setAuxValue?: (value: string) => void;
};
export const Select: React.FC<TVSelectProps> = ({
  name,
  label,
  helper,
  isLoading,
  skeletonWidth,
  skeletonHeight = 70,
  onChange,
  children,
  auxValue,
  setAuxValue,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {fieldName, defaultValue, registerField, error} = useField(name);

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    auxValue && setValue(auxValue);
  }, [auxValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: () => value,
      setValue: (_, value) => setValue(value),
    });
  }, [fieldName, value, registerField]);

  const handleChange = (e: any, node: any) => {
    setValue(e.target.value);
    setAuxValue && setAuxValue(e.target.value);
    onChange && onChange(e, node);
  };

  if (isLoading)
    return (
      <Skeleton
        width={skeletonWidth}
        sx={{margin: 0}}
        height={skeletonHeight}
      />
    );

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id={String(label)}>{label}</InputLabel>
      <MuiSelect
        {...rest}
        labelId={String(label)}
        ref={inputRef}
        label={label}
        error={!!error}
        value={value || ''}
        onChange={handleChange}
        defaultValue={defaultValue || ''}>
        {children}
      </MuiSelect>
      {error ? (
        <FormHelperText error>{error}</FormHelperText>
      ) : (
        helper && <FormHelperText>{helper}</FormHelperText>
      )}
    </FormControl>
  );
};
