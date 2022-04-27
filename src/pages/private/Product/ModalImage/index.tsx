import React, {ChangeEvent, useCallback, useState} from 'react';
import {useMutation} from 'react-query';

import {AddAPhotoRounded} from '@mui/icons-material';
import {Card, Stack} from '@mui/material';
import {Modal} from 'shared/components';
import {feedback} from 'shared/services/alertService';
import {productService} from 'shared/services/api/product';

interface IProps {
  openModal: boolean;
  onClose(): void;
  id: string;
}

export const ModalImage: React.FC<IProps> = ({openModal, onClose, id}) => {
  const [image, setImage] = useState<File | undefined>();
  const [preview, setPreview] = useState('');

  const {mutate, isLoading} = useMutation(
    (image: File) => productService.updateImageProduct(id, image),
    {
      onSuccess: () => {
        onClose();
        feedback('Registro atualizado com sucesso', 'success');
      },
      onError: () => {
        feedback('Erro ao atualizar registro', 'error');
      },
    },
  );

  const handleBasePreview = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(undefined);
    } else {
      const previewURL = URL.createObjectURL(file);
      setImage(file);
      setPreview(previewURL);
    }
  }, []);

  const handleClose = useCallback(() => {
    setImage(undefined);
    setPreview('');
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!image) return;

    mutate(image);

    if (!isLoading) {
      setImage(undefined);
      setPreview('');
      onClose();
    }
  }, [image, isLoading, mutate, onClose]);

  return (
    <Modal
      opened={openModal}
      onClick={handleSubmit}
      onClose={handleClose}
      loading={isLoading}
      labelSaveButton="Adicionar"
      labelCloseButton="Cancelar"
      title="Imagem do produto">
      <label htmlFor="image_list">
        <Card>
          {preview ? (
            <Stack
              title="Trocar de foto"
              width="100%"
              height={{md: 600, xs: 400}}
              style={{
                backgroundImage: `url(${preview})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                cursor: 'pointer',
              }}
            />
          ) : (
            <Stack
              title="Adicionar foto"
              width="100%"
              height={{md: 600, xs: 400}}
              display="flex"
              flex={1}
              justifyContent="center"
              alignItems="center"
              style={{
                cursor: 'pointer',
              }}>
              <AddAPhotoRounded fontSize="large" color="primary" />
            </Stack>
          )}
        </Card>
      </label>
      <input
        type="file"
        onChange={handleBasePreview}
        id="image_list"
        style={{display: 'none'}}
      />
    </Modal>
  );
};
