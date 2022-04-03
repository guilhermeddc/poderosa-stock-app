import React, {useCallback, useEffect, useState} from 'react';
import {useQuery, useQueryClient} from 'react-query';
import {useNavigate} from 'react-router-dom';

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
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {logoRet} from 'shared/assets';
import {Notification} from 'shared/components';
import {useAuth, useTitle} from 'shared/hooks';
import {notificationService} from 'shared/services/api/notifications';

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
  const {user, isAdmin} = useAuth();
  const theme = useTheme();
  const matches = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {data} = useQuery(
    'notifications',
    notificationService.getNotifications,
  );

  const handleClickNotifyMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNotify(event.currentTarget);
    },
    [],
  );

  const handleCloseNotifyMenu = useCallback(
    async (id?: string, link?: string) => {
      id && (await notificationService.markAsRead(id));

      queryClient.invalidateQueries('notifications');

      link && navigate(link);
      setAnchorElNotify(null);
    },
    [queryClient, navigate],
  );

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
          {isAdmin && (
            <IconButton
              color="inherit"
              id="notify-button"
              disabled={data?.length === 0}
              onClick={handleClickNotifyMenu}>
              <Badge badgeContent={data?.length} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
          )}

          <Menu
            sx={{mt: 3, left: matches ? -100 : 0, maxWidth: 350}}
            id="notify-menu"
            MenuListProps={{
              'aria-labelledby': 'notify-button',
            }}
            anchorEl={anchorElNotify}
            open={openNotifyMenu}
            onClose={() => handleCloseNotifyMenu()}>
            <MenuItem disabled>
              <Box width={300}>
                <Typography align="center">
                  {data?.length} novas notificações
                </Typography>
              </Box>
            </MenuItem>

            <Divider />

            {data?.map((item) => (
              <Notification
                key={item.id}
                data={item}
                onClick={() => handleCloseNotifyMenu(item.id, item.link)}
              />
            ))}

            <Divider />

            <MenuItem onClick={() => handleCloseNotifyMenu()}>
              <Box width={300}>
                <Typography align="center">Ver todas notificações</Typography>
              </Box>
            </MenuItem>
          </Menu>

          <Box ml={1} height={16} width="1px" bgcolor="#B3DBD9" />

          <Box gap={2} display="flex" alignItems="center">
            {user?.imageUrl && user.name ? (
              <Avatar alt={user.name} src={user?.imageUrl} />
            ) : (
              <Avatar>
                {`${user.name?.split(' ')[0][0]}
              ${user.name?.split(' ')[1][0]}`}
              </Avatar>
            )}
            {matches && (
              <Typography>
                Olá, <strong>{user.name}</strong>
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </MuiAppBar>
  );
};
