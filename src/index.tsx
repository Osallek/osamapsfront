import { ThemeProvider } from '@mui/material';
import fr from 'i18n/fr';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import theme from './theme';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
