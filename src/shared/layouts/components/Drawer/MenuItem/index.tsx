import React from 'react';
import {NavLink} from 'react-router-dom';

import {ChevronRightRounded} from '@mui/icons-material';
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {IMenuOptions} from 'shared/context/Drawer';
import {useDrawer} from 'shared/hooks';

import {MuiIcon} from '../../styles';

interface IProps {
  menuItem: IMenuOptions;
  onClick(): void;
  drawerOpen: boolean;
}

export const MenuItem: React.FC<IProps> = ({menuItem, onClick, drawerOpen}) => {
  const theme = useTheme();
  const {setDrawerOpen} = useDrawer();

  return menuItem.subMenu ? (
    <ListItem
      button
      onClick={onClick}
      key={menuItem.id}
      sx={{
        height: theme.spacing(7),
        color: theme.palette.secondary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.secondary.main,
        },
      }}
      secondaryAction={
        drawerOpen && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <ChevronRightRounded
              sx={{color: theme.palette.primary.contrastText}}
            />
          </Box>
        )
      }>
      <ListItemIcon>
        <MuiIcon>{menuItem.icon}</MuiIcon>
      </ListItemIcon>
      <ListItemText primary={menuItem.label} />
    </ListItem>
  ) : (
    <ListItem
      button
      key={menuItem.id}
      to={menuItem.path}
      onClick={() => setDrawerOpen(false)}
      component={NavLink as any}
      style={
        (({isActive}: any) =>
          isActive
            ? {
                backgroundColor: theme.palette.divider,
                color: theme.palette.secondary.contrastText,
                fontWeight: 'bold',
                borderLeftWidth: 4,
                borderLeftColor: theme.palette.secondary.contrastText,
                borderLeftStyle: 'solid',
                height: theme.spacing(7),
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                },
              }
            : {
                height: theme.spacing(7),
                color: theme.palette.secondary.contrastText,
                borderLeftWidth: 4,
                borderLeftColor: 'transparent',
                borderLeftStyle: 'solid',
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                },
              }) as any
      }>
      <ListItemIcon>
        <MuiIcon sx={{marginLeft: 0.5}}>{menuItem.icon}</MuiIcon>
      </ListItemIcon>
      <ListItemText primary={menuItem.label} />
    </ListItem>
  );
};
