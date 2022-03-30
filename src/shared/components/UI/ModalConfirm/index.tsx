import React from 'react';

import {Typography} from '@mui/material';

import {Modal} from '../Modal';

interface IProps {
  opened: boolean;
  onClick(): void;
  onClose(): void;
  loading: boolean;
  title?: string;
  term?: string;
  labelSaveButton?: string;
  description?: string;
}

export const ModalConfirm: React.FC<IProps> = ({
  opened,
  onClick,
  onClose,
  loading,
  title = 'Confirmação de exclusão',
  term = 'registro',
  labelSaveButton = 'Excluir',
  description,
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
        <Typography>
          {description
            ? description
            : `Tem certeza que deseja excluir este ${term}?`}
        </Typography>
      </Modal>
    </>
  );
};
