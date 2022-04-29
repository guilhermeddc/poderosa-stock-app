import React, {useCallback} from 'react';

import {ExpandLessRounded, ExpandMoreRounded} from '@mui/icons-material';
import {
  Collapse,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {IMenuOptions} from 'shared/context/Drawer';

import {MuiIcon} from '../../styles';
import {MenuItem} from '../MenuItem';

interface IProps {
  menuItem: IMenuOptions;
  menuSelected: string[];
  setMenuSelected(value: string[]): void;
  onClick(): void;
}

export const SubMenuItem: React.FC<IProps> = ({
  menuItem,
  onClick,
  menuSelected,
  setMenuSelected,
}) => {
  const theme = useTheme();

  const handleMenuSelected = useCallback(
    (idMenu: string) => {
      if (menuSelected.includes(idMenu)) {
        setMenuSelected(menuSelected.filter((item) => item !== idMenu));
      } else {
        setMenuSelected([...menuSelected, idMenu]);
      }
      onClick();
    },
    [menuSelected, onClick, setMenuSelected],
  );

  return menuItem.path ? (
    <MenuItem menuItem={menuItem} onClick={onClick} drawerOpen />
  ) : (
    <>
      <ListItem
        onClick={() => handleMenuSelected(menuItem.id)}
        sx={{
          height: theme.spacing(7),
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          },
        }}>
        <ListItemIcon>
          <MuiIcon>{menuItem.icon}</MuiIcon>
        </ListItemIcon>
        <ListItemText primary={menuItem.label} />
        {menuSelected.includes(menuItem.id) ? (
          <ExpandLessRounded />
        ) : (
          <ExpandMoreRounded />
        )}
      </ListItem>
      <Collapse
        in={menuSelected.includes(menuItem.id)}
        timeout="auto"
        unmountOnExit>
        {menuItem.subMenu ? (
          menuItem.subMenu.map((sub: IMenuOptions) =>
            sub.path ? (
              <MenuItem menuItem={sub} onClick={onClick} drawerOpen />
            ) : (
              <>
                <SubMenuItem
                  menuItem={sub}
                  menuSelected={menuSelected}
                  onClick={onClick}
                  setMenuSelected={setMenuSelected}
                />
                {menuSelected.includes(sub.id) && <Divider />}
              </>
            ),
          )
        ) : (
          <MenuItem menuItem={menuItem} onClick={onClick} drawerOpen />
        )}
      </Collapse>
    </>
  );
};
