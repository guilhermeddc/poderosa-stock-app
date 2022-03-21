import React from 'react';

import {ExpandMoreRounded} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useMediaQuery,
} from '@mui/material';

interface IProps {}

export const FilterData: React.FC<IProps> = ({children}) => {
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{paddingX: 4}}>
        <Typography variant="subtitle1">Filtros</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{px: matches ? 8 : 4, pb: 4}}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
