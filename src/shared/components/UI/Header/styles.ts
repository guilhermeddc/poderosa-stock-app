import {TextField, styled} from '@mui/material';

export const CssTextField = styled(TextField)(({theme}) => ({
  root: {
    '& .MuiSelect-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));
