import {
  AppBar,
  AppBarProps,
  CSSObject,
  Drawer,
  Icon,
  styled,
  Theme,
} from '@mui/material';

export const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.primary.main,
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(9)} + 1px)`,
  [theme.breakpoints.down('md')]: {
    width: 0,
  },
});

export const MuiIcon = styled(Icon)(({theme}) => ({
  color: theme.palette.secondary.contrastText,
  marginLeft: theme.spacing(0.9),
}));

interface MuiAppBarProps extends AppBarProps {
  open?: boolean;
}

export const MuiAppBar = styled(AppBar)<MuiAppBarProps>(({theme}) => ({
  boxShadow: 'none',
  height: 66,
  border: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

export const MuiDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
  boxShadow: 'none',
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
  '*::-webkit-scrollbar': {
    width: 6,
    height: 8,
  },
  '*::-webkit-scrollbar-thumb': {
    backgroundColor: '#E0E0E0',
    borderRadius: 50,
    width: 12,
    maxHeight: 100,
  },
}));
