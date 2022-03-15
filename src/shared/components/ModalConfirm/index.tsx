import React from 'react';

import {Box, Typography} from '@mui/material';

import {Modal} from '../Modal';

interface IProps {
  opened: boolean;
  onClick(): void;
  onClose(): void;
  loading: boolean;
  title?: string;
  term?: string;
  labelSaveButton?: string;
}

export const ModalConfirm: React.FC<IProps> = ({
  opened,
  onClick,
  onClose,
  loading,
  title = 'Confirmação de exclusão',
  term = 'registro',
  labelSaveButton = 'Excluir',
  children,
}) => {
  return (
    <>
      <Modal
        opened={opened}
        onClick={onClick}
        maxWidth="xs"
        onClose={onClose}
        loading={loading}
        labelSaveButton={labelSaveButton}
        labelCloseButton="Cancelar"
        title={title}>
        <Box marginTop={1} marginBottom={3}>
          {children ? (
            children
          ) : (
            <Typography>Tem certeza que deseja excluir este {term}?</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};
