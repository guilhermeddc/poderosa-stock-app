import React from 'react';

import {
  DialogActions,
  DialogContent,
  Dialog,
  Typography,
  CircularProgress,
  Box,
  useTheme,
} from '@mui/material';

import {Button} from '../Button';

interface IProps {
  loading?: boolean;
  disabled?: boolean;
  opened: boolean;
  onClose(): void;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
  title?: string;
  labelCloseButton?: string;
  labelSaveButton?: string;
  onClick(): void;
}

export const Modal: React.FC<IProps> = ({
  opened,
  loading = false,
  disabled = false,
  onClose,
  maxWidth,
  title,
  children,
  labelCloseButton,
  labelSaveButton,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={opened} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {title && (
        <Typography
          variant="h6"
          color="primary"
          style={{
            padding: '32px 24px 0',
          }}>
          <strong>{title}</strong>
        </Typography>
      )}
      <DialogContent>{children}</DialogContent>
      {(labelSaveButton || labelCloseButton) && (
        <DialogActions
          style={{
            padding: '8px 24px 32px',
          }}>
          {labelCloseButton && (
            <Button
              variant="outlined"
              disabled={loading}
              label={labelCloseButton}
              onClick={onClose}
            />
          )}
          <Box marginLeft={1} />
          {labelSaveButton && (
            <Button
              label={labelSaveButton}
              onClick={onClick}
              disabled={loading || disabled}>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -theme.spacing(1.5),
                    marginLeft: -theme.spacing(1.5),
                  }}
                />
              )}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
