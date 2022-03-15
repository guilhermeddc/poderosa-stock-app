import React, {useCallback, useMemo, useState} from 'react';

import {ChevronLeftRounded} from '@mui/icons-material';
import {
  Box,
  Divider,
  Icon,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  useTheme,
} from '@mui/material';
import {IMenuOptions} from 'shared/context/Drawer';
import {feedback} from 'shared/services/alertService';

import {drawerWidth, MuiDrawer, MuiIcon} from '../styles';
import {MenuItem} from './MenuItem';

interface IProps {
  drawerOpen: boolean;
  buttonActive: boolean;
  menuOptions?: any[];
  onMouseEnter: () => void | undefined;
  onMouseLeave: () => void | undefined;
}

export const Drawer: React.FC<IProps> = ({
  drawerOpen,
  buttonActive,
  menuOptions,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [filter, setFilter] = useState('');
  const [menuSelected, setMenuSelected] = useState<IMenuOptions[]>([]);
  const [menuFather, setMenuFather] = useState({} as IMenuOptions);
  const theme = useTheme();

  const filteredMenuOptions: IMenuOptions[] = useMemo(() => {
    if (menuOptions) {
      return menuOptions.filter((item) =>
        item.label.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    feedback('Erro ao carregar as opções de menu.', 'error');
    return [] as IMenuOptions[];
  }, [filter, menuOptions]);

  const handleSelectMenu = useCallback(
    (subMenu: IMenuOptions[], menu: IMenuOptions) => {
      setMenuSelected(subMenu);
      setMenuFather(menu);
    },
    [],
  );

  return (
    <>
      <MuiDrawer
        open={drawerOpen}
        variant="permanent"
        sx={{mt: 2}}
        onMouseEnter={buttonActive ? undefined : onMouseEnter}
        onMouseLeave={buttonActive ? undefined : onMouseLeave}>
        <Box
          position="fixed"
          zIndex={theme.zIndex.drawer + 1}
          sx={{
            backgroundColor: theme.palette.primary.main,
            width: drawerOpen ? drawerWidth : theme.spacing(9),
            boxShadow: theme.shadows[12],
            transition: drawerOpen
              ? theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                })
              : theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
            overflowX: 'hidden',
            [theme.breakpoints.up('sm')]: {
              width: drawerOpen ? drawerWidth : theme.spacing(9),
            },
            [theme.breakpoints.down('sm')]: {
              width: '0',
              padding: '0',
            },
          }}
          width={360}>
          <Toolbar />

          <ListItem sx={{height: 80, marginY: theme.spacing(0.7)}}>
            {!drawerOpen ? (
              <ListItemIcon>
                <Icon
                  sx={{
                    color: theme.palette.secondary.contrastText,
                    marginTop: theme.spacing(0.7),
                    marginLeft: theme.spacing(0.9),
                  }}>
                  search
                </Icon>
              </ListItemIcon>
            ) : (
              <TextField
                fullWidth
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                placeholder="Buscar"
                size="small"
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: 2,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        sx={{
                          color: theme.palette.secondary.contrastText,
                        }}>
                        search
                      </Icon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </ListItem>
        </Box>

        <List sx={{position: 'relative', top: 146, height: '80%'}}>
          {menuSelected.length === 0 ? (
            menuOptions &&
            filteredMenuOptions?.map((item) => (
              <MenuItem
                key={item.id}
                menuItem={item}
                onClick={() => handleSelectMenu(item.subMenu || [], item)}
                drawerOpen={drawerOpen}
              />
            ))
          ) : (
            <>
              <ListItem
                button
                onClick={() => setMenuSelected([])}
                sx={{
                  height: theme.spacing(7),
                  color: theme.palette.secondary.contrastText,
                  backgroundColor: theme.palette.primary.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.main,
                  },
                }}>
                <ListItemIcon>
                  <ChevronLeftRounded
                    sx={{
                      color: theme.palette.secondary.contrastText,
                      marginLeft: theme.spacing(0.9),
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={menuFather.label} />
              </ListItem>

              <Divider />

              {menuSelected.map((item) => (
                <MenuItem
                  key={item.id}
                  menuItem={item}
                  drawerOpen={drawerOpen}
                  onClick={() => handleSelectMenu(item.subMenu || [], item)}
                />
              ))}
            </>
          )}
          <Toolbar />

          <ListItem
            button
            sx={{
              height: theme.spacing(7),
              color: theme.palette.secondary.contrastText,
              backgroundColor: theme.palette.primary.main,
              bottom: 0,
              zIndex: theme.zIndex.drawer + 1,
              boxShadow: theme.shadows[6],
              '&:hover': {
                backgroundColor: theme.palette.secondary.main,
              },
              position: 'fixed',
              width: drawerOpen ? drawerWidth : theme.spacing(9),
              transition: drawerOpen
                ? theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  })
                : theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
              overflowX: 'hidden',
              [theme.breakpoints.up('sm')]: {
                width: drawerOpen ? drawerWidth : theme.spacing(9),
              },
              [theme.breakpoints.down('sm')]: {
                width: '0',
                padding: '0',
              },
            }}>
            <ListItemIcon>
              <MuiIcon>logout</MuiIcon>
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </MuiDrawer>
    </>
  );
};
