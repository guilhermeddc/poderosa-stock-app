import React from 'react';

import {ExpandMoreRounded} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';

interface IProps {}

export const FilterData: React.FC<IProps> = ({children}) => {
  return (
    <Accordion variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{paddingX: 4}}>
        <Typography variant="subtitle1">Filtros</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
