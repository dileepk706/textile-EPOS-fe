// i18n
import '@locales/i18n';
import '../App.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SnackbarProvider from 'shared/ui/snackbar/SnackbarProvider';
// auth
import enLocale from 'date-fns/locale/en-GB';
import ThemeProvider from '@theme/index';
import { BootstrappedRouter } from '../routes';
import { SettingsProvider } from 'shared/ui/settings';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'bold', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <SnackbarProvider>
            <BootstrappedRouter />
          </SnackbarProvider>
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}
