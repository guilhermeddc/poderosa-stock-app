import React from 'react';

import {
  MenuItem,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  Icon,
  Tooltip,
} from '@mui/material';
import {INotification} from 'shared/services/api/notifications';

interface IProps {
  data: INotification;
  onClick?(): void;
}

export const Notification: React.FC<IProps> = ({data, onClick}) => {
  return (
    <MenuItem onClick={onClick} disableRipple>
      <ListItem disablePadding>
        {data.icon ? (
          <ListItemIcon>
            <Icon>{data.icon}</Icon>
          </ListItemIcon>
        ) : (
          <ListItemAvatar>
            <Avatar>GV</Avatar>
          </ListItemAvatar>
        )}
        <Tooltip title={data.body}>
          <ListItemText
            primary={data.title}
            secondary={data.body.slice(0, 35) + '...'}
          />
        </Tooltip>
      </ListItem>
    </MenuItem>
  );
};
