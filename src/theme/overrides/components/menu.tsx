import { Theme } from '@mui/material/styles';
//
// eslint-disable-next-line import/extensions
import { menuItem } from '@theme/css';

// ----------------------------------------------------------------------

export default function Menu(theme: Theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...menuItem(theme),
        },
      },
    },
  };
}
