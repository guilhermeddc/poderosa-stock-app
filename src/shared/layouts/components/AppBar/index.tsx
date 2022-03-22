import React, {useCallback, useEffect, useState} from 'react';

import {
  MenuOpenRounded,
  MenuRounded,
  NotificationsOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {logoRet} from 'shared/assets';
import {useAuth, useTitle} from 'shared/hooks';

import {MuiAppBar} from '../styles';

interface IProps {
  drawerOpen: boolean;
  buttonActive: boolean;
  handleDrawerOpen(): void;
  setButtonActive(value: boolean): void;
}

export const AppBar: React.FC<IProps> = ({
  drawerOpen,
  buttonActive,
  setButtonActive,
  handleDrawerOpen,
}) => {
  const [anchorElNotify, setAnchorElNotify] = useState<null | HTMLElement>(
    null,
  );
  const openNotifyMenu = Boolean(anchorElNotify);

  const {title} = useTitle();
  const {user} = useAuth();
  const theme = useTheme();
  const matches = useMediaQuery('(min-width:600px)');

  const handleClickNotifyMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNotify(event.currentTarget);
    },
    [],
  );

  const handleCloseNotifyMenu = useCallback(() => {
    setAnchorElNotify(null);
  }, []);

  const handleOpenMenu = useCallback(() => {
    handleDrawerOpen();

    setButtonActive(!buttonActive);
  }, [buttonActive, handleDrawerOpen, setButtonActive]);

  useEffect(() => {
    if (!drawerOpen && buttonActive) setButtonActive(false);
  }, [buttonActive, drawerOpen, setButtonActive]);

  return (
    <MuiAppBar position="fixed" open={drawerOpen}>
      <Grid container>
        <Grid item xs={6}>
          <List>
            <ListItem>
              <ListItemIcon>
                <IconButton
                  size="small"
                  onClick={handleOpenMenu}
                  sx={{
                    marginLeft: theme.spacing(0.5),
                    backgroundColor: buttonActive
                      ? theme.palette.divider
                      : 'transparent',
                  }}>
                  {buttonActive ? (
                    <MenuOpenRounded
                      sx={{color: theme.palette.secondary.contrastText}}
                    />
                  ) : (
                    <MenuRounded
                      sx={{color: theme.palette.secondary.contrastText}}
                    />
                  )}
                </IconButton>
              </ListItemIcon>

              {matches && (
                <Box ml={4} mr={2} height={16} width="1px" bgcolor="#B3DBD9" />
              )}

              <img src={logoRet} alt="GVCentris" height={32} />

              <Typography variant="h6" sx={{marginLeft: theme.spacing(2)}}>
                {title}
              </Typography>
            </ListItem>
          </List>
        </Grid>

        <Grid
          item
          xs={6}
          component={Box}
          height={66}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
          paddingRight={3}>
          <IconButton
            color="inherit"
            id="notify-button"
            onClick={handleClickNotifyMenu}>
            <Badge badgeContent={3} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>

          <Menu
            sx={{mt: 3, left: matches ? -100 : 0, maxWidth: 350}}
            id="notify-menu"
            MenuListProps={{
              'aria-labelledby': 'notify-button',
            }}
            anchorEl={anchorElNotify}
            open={openNotifyMenu}
            onClose={handleCloseNotifyMenu}>
            <MenuItem disabled>
              <Box width={300}>
                <Typography align="center">3 novas notificações</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseNotifyMenu} disableRipple>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>GV</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="GVdasa"
                  secondary={
                    'Mensagem exemplo para ver como fica'.slice(0, 25) + '...'
                  }
                  sx={{maxWidth: 200}}
                />
              </ListItem>
            </MenuItem>
            <MenuItem onClick={handleCloseNotifyMenu} disableRipple>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>GV</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="GVdasa"
                  secondary={
                    'Mensagem exemplo para ver como fica'.slice(0, 25) + '...'
                  }
                />
              </ListItem>
            </MenuItem>
            <MenuItem onClick={handleCloseNotifyMenu} disableRipple>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>GV</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="GVdasa"
                  secondary={
                    'Mensagem exemplo para ver como fica'.slice(0, 25) + '...'
                  }
                />
              </ListItem>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleCloseNotifyMenu}>
              <Box width={300}>
                <Typography align="center">Ver todas notificações</Typography>
              </Box>
            </MenuItem>
          </Menu>

          <Box ml={1} height={16} width="1px" bgcolor="#B3DBD9" />

          <Box gap={2} display="flex" alignItems="center">
            {user.photoURL && user.displayName ? (
              <Avatar alt={user.displayName} src={user.photoURL} />
            ) : (
              <Avatar>
                {`${user.displayName?.split(' ')[0][0]}
              ${user.displayName?.split(' ')[1][0]}`}
              </Avatar>
            )}
            {matches && (
              <Typography>
                Olá, <strong>{user.displayName}</strong>
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </MuiAppBar>
  );
};
