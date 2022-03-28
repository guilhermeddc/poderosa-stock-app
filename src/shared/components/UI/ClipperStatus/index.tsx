import React from 'react';

import {Chip} from '@mui/material';

interface IProps {
  labelTrue: string;
  labelFalse: string;
  status: boolean;
}

export const ClipperStatus: React.FC<IProps> = ({
  labelTrue,
  labelFalse,
  status,
}) => {
  return status ? (
    <Chip label={labelTrue} sx={{bgcolor: '#91CBC8'}} />
  ) : (
    <Chip label={labelFalse} sx={{bgcolor: '#FB96A0'}} />
  );
};
