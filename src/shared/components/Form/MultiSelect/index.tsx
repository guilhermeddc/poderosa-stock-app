import React, {useEffect, useState, useRef} from 'react';

import {
  Select as MuiSelect,
  SelectProps,
  FormHelperText,
  InputLabel,
  FormControl,
  Skeleton,
} from '@mui/material';
import {useField} from '@unform/core';

export const MultiSelect: React.FC<
  SelectProps & {
    name: string;
    skeletonWidth?: number;
    skeletonHeight?: number;
    isLoading?: boolean;
    helper?: string;
  }
> = ({
  name,
  helper,
  onChange,
  children,
  label,
  isLoading,
  skeletonWidth,
  skeletonHeight = 70,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {fieldName, registerField, error, defaultValue} = useField(name);
  const [selectValue, setValue] = useState<string[]>(defaultValue || []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: () => selectValue,
      setValue: (_, value) => setValue(value),
    });
  }, [fieldName, selectValue, registerField]);

  // eslint-disable-next-line
  const handleChange = (e: any, node: any): void => {
    setValue(e.target.value as string[]);
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
        labelId={String(label)}
        ref={inputRef}
        label={label}
        error={!!error}
        defaultValue={defaultValue}
        {...rest}
        value={selectValue as string[]}
        onChange={handleChange}
        multiple>
        {children}
      </MuiSelect>
      {error ? (
        <FormHelperText error={!!error}>{error}</FormHelperText>
      ) : (
        helper && <FormHelperText>{helper}</FormHelperText>
      )}
    </FormControl>
  );
};
