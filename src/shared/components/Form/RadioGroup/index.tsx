import React, {useEffect, useState} from 'react';

import {
  FormControl,
  Skeleton,
  FormControlProps,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
} from '@mui/material';
import {useField} from '@unform/core';

type TVRadioGroupProps<T> = {
  name: string;
  children?: void;
  label?: React.ReactNode;
  row?: boolean;
  isBoolean?: boolean;
  isLoading?: boolean;
  skeletonWidth?: number;
  skeletonHeight?: number;
  formControlProps?: FormControlProps;
  // eslint-disable-next-line
  onChange?: (event: React.ChangeEvent<unknown>, value: T) => void;
  options: {
    value: T;
    label?: string;
    disabled?: boolean;
  }[];
};
export function RadioGroup<T extends string | number = string | number>({
  name,
  row,
  isBoolean,
  label,
  options,
  formControlProps,
  isLoading,
  skeletonWidth,
  skeletonHeight = 50,
  onChange,
}: TVRadioGroupProps<T>) {
  const {fieldName, defaultValue, error, registerField} = useField(name);

  const [value, setValue] = useState(
    isBoolean ? String(defaultValue) : defaultValue,
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => (isBoolean ? value === 'true' : value),
      setValue: (_, value) => setValue(isBoolean ? String(value) : value),
    });
  }, [fieldName, isBoolean, value, registerField]);

  // eslint-disable-next-line
  const handleChange = (event: React.ChangeEvent<{}>, value: T) => {
    setValue(value);
    onChange && onChange(event, value);
  };

  return (
    <FormControl margin="none" {...formControlProps}>
      <FormLabel required>{label}</FormLabel>

      {isLoading && <Skeleton height={skeletonHeight} width={skeletonWidth} />}
      {!isLoading && (
        <MuiRadioGroup row={row} value={String(value)}>
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              name={fieldName}
              control={<Radio />}
              value={option.value}
              label={option.label || ''}
              disabled={option.disabled}
              onChange={(e) => handleChange(e, option.value)}
            />
          ))}
        </MuiRadioGroup>
      )}

      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
}
