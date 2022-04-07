import React from 'react';

import {
  DialogActions,
  DialogContent,
  Dialog,
  Typography,
  Box,
  useMediaQuery,
  Grid,
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
  const matches = useMediaQuery('(min-width:769px)');

  return (
    <Dialog open={opened} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {title && (
        <Box pt={3} pb={1} px={3}>
          <Typography
            variant={matches ? 'h5' : 'h6'}
            fontWeight={500}
            color="primary">
            {title}
          </Typography>
        </Box>
      )}
      <DialogContent>{children}</DialogContent>
      {(labelSaveButton || labelCloseButton) && (
        <DialogActions
          sx={{
            pb: 3,
            px: 3,
          }}>
          {!matches ? (
            <Grid container spacing={3}>
              {labelCloseButton && (
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth={!matches}
                    disabled={loading}
                    onClick={onClose}
                    label={labelCloseButton}
                  />
                </Grid>
              )}
              {labelSaveButton && (
                <Grid item xs={6}>
                  <Button
                    label={labelSaveButton}
                    fullWidth={!matches}
                    onClick={onClick}
                    loading={loading}
                    disabled={loading || disabled}
                  />
                </Grid>
              )}
            </Grid>
          ) : (
            <>
              {labelCloseButton && (
                <Button
                  variant="outlined"
                  fullWidth={!matches}
                  disabled={loading}
                  onClick={onClose}
                  label={labelCloseButton}
                />
              )}
              <Box marginLeft={2} />
              {labelSaveButton && (
                <Button
                  label={labelSaveButton}
                  fullWidth={!matches}
                  onClick={onClick}
                  loading={loading}
                  disabled={loading || disabled}
                />
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
