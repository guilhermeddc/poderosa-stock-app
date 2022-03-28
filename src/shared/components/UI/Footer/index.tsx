import React from 'react';

import {Box, Container, Paper, useTheme} from '@mui/material';
import {useDrawer} from 'shared/hooks';

import {Button} from '../Button';

interface IProps {
  disabled?: boolean;
  onSave?(): Promise<void> | void;
  onSaveLabel?: string;
  onSaveAndNew?(): void;
  onGoBack?(): void;
  onCancel?(): void;
}

export const Footer: React.FC<IProps> = ({
  disabled = false,
  onSaveLabel = 'Salvar',
  onSave,
  onSaveAndNew,
  onGoBack,
  onCancel,
  children,
}) => {
  const {drawerOpen} = useDrawer();
  const theme = useTheme();

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={theme.zIndex.appBar}>
      <Paper elevation={4}>
        <Box
          marginLeft={drawerOpen ? 35 : 9}
          style={{
            transition: 'all 0.25s',
          }}>
          <Container maxWidth="xl">
            <Box
              height="78px"
              display="flex"
              alignItems="center"
              justifyContent="flex-end">
              {children ? (
                children
              ) : (
                <>
                  {onCancel && (
                    <Box width={170}>
                      <Button
                        label="Cancelar"
                        variant="outlined"
                        onClick={onCancel}
                        fullWidth
                        size="large"
                      />
                    </Box>
                  )}

                  {onGoBack && (
                    <Box marginLeft={2} width={170}>
                      <Button
                        label="Voltar"
                        disabled={disabled}
                        onClick={onGoBack}
                        fullWidth
                        size="large"
                      />
                    </Box>
                  )}

                  <Box marginLeft={2} width={170}>
                    <Button
                      label={onSaveAndNew ? 'Salvar e Voltar' : onSaveLabel}
                      disabled={disabled}
                      onClick={onSave}
                      fullWidth
                      size="large"
                    />
                  </Box>

                  {onSaveAndNew && (
                    <Box marginLeft={2} width={170}>
                      <Button
                        label="Salvar e Novo"
                        disabled={disabled}
                        onClick={onSaveAndNew}
                        fullWidth
                        size="large"
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Container>
        </Box>
      </Paper>
    </Box>
  );
};
