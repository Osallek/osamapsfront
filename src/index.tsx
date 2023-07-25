import { ThemeProvider } from '@mui/material';
import App from 'App';
import fr from 'i18n/fr';
import 'index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import theme from 'theme';

const language = navigator.language;
let locale = fr.locale;
let messages = fr.messages;

if (language.startsWith("fr")) {
  locale = fr.locale;
  messages = fr.messages;
}

const cache = createIntlCache();
export const intl = createIntl({
  locale,
  messages,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  onError: err => {}
}, cache);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RawIntlProvider value={ intl }>
    <ThemeProvider theme={ theme }>
      <App/>
    </ThemeProvider>
  </RawIntlProvider>
);
