// eslint-disable-next-line import-helpers/order-imports
import FullCalendar from '@fullcalendar/react';
import React, {useMemo, useState} from 'react';
import {useQuery} from 'react-query';

// eslint-disable-next-line import-helpers/order-imports
import brLocale from '@fullcalendar/core/locales/pt-br';

// eslint-disable-next-line import-helpers/order-imports
import dayGridPlugin from '@fullcalendar/daygrid';
import {Grid, Stack} from '@mui/material';
import {Button, Title} from 'shared/components';
import {moneyMask} from 'shared/helpers/masks';
import {movementsService} from 'shared/services/api/movementsService';

import {ModalMovement} from './ModalMovement';

const Movements: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const {data} = useQuery('movements', () => movementsService.getMovements());

  const events = useMemo(() => {
    if (!data) {
      return [];
    }

    const aux: any[] = [];

    data.map((movement) => {
      if (movement.installments.length > 0) {
        movement.installments.map((installment) => {
          aux.push({
            title: `${
              movement.movement === 'purchase' ? 'Compra' : 'Venda'
            } - ${moneyMask(installment.amount)}`,
            start: installment.date,
            end: installment.date,
            color: '#f44336',
          });
        });
      } else {
        aux.push({
          title: `${
            movement.movement === 'purchase' ? 'Compra' : 'Venda'
          } - ${moneyMask(movement.amount)}`,
          start: movement.date,
          end: movement.date,
          color: '#00bcd4',
        });
      }
    });

    return aux;
  }, [data]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            spacing={3}
            direction="row"
            alignItems="center"
            justifyContent="space-between">
            <Title title="Gestão de movimentos" />

            <Button
              label="Novo movimento"
              onClick={() => setOpenModal(true)}
              variant="outlined"
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <FullCalendar
            locales={[brLocale]}
            locale="pt-br"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
          />
        </Grid>
      </Grid>

      <ModalMovement
        onClose={() => setOpenModal(false)}
        openModal={openModal}
      />
    </>
  );
};

export default Movements;
