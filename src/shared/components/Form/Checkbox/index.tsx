import React, {useEffect, useState} from 'react';

import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  useTheme,
  Skeleton,
} from '@mui/material';
import {useField} from '@unform/core';

type TVCheckboxProps = Omit<CheckboxProps, 'checked'> & {
  name: string;
  isLoading?: boolean | undefined;
  skeletonWidth?: number | undefined;
  skeletonHeight?: number | undefined;
};
export const Checkbox: React.FC<TVCheckboxProps> = ({
  name,
  isLoading,
  skeletonWidth = 20,
  skeletonHeight = 20,
  onChange,
  ...rest
}) => {
  const {fieldName, defaultValue = false, registerField} = useField(name);
  const theme = useTheme();

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    registerField<boolean>({
      name: fieldName,
      getValue: () => value,
      setValue: (_, value) => setValue(value),
    });
  }, [defaultValue, fieldName, registerField, value]);

  const handleChange = (event: any) => {
    setValue(!value);
    onChange && onChange(event, !value);
  };

  if (isLoading)
    return (
      <Skeleton
        variant="circular"
        width={skeletonWidth}
        height={skeletonHeight}
        style={{margin: theme.spacing(2)}}
      />
    );

  return (
    <MuiCheckbox
      {...rest}
      checked={value}
      name={fieldName}
      onInput={handleChange}
    />
  );
};
