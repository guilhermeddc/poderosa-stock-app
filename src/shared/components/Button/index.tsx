import React from 'react';

import {Button as MuiButton, ButtonProps} from '@mui/material';

import {CircularProgress} from './styles';

interface IProps extends ButtonProps {
  label?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'success'
    | 'info'
    | 'warning'
    | undefined;
  error?: boolean;
  size?: 'small' | 'medium' | 'large';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  minWidth?: number;
  loading?: boolean;
}

export const Button: React.FC<IProps> = ({
  label,
  children,
  variant = 'contained',
  color = 'primary',
  size = 'large',
  textTransform = 'none',
  error = false,
  minWidth = 120,
  loading = false,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      variant={variant}
      color={color}
      size={size}
      style={{
        textTransform,
        color: error ? '#F50000' : undefined,
        borderColor: error ? '#F50000' : undefined,
        minWidth: minWidth,
      }}>
      {loading ? <CircularProgress size={24} /> : children ?? label}
    </MuiButton>
  );
};
