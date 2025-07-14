import { PrimeReactProvider } from 'primereact/api';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './router';
import GlobalStyles from './styles/GlobalStyle';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyles />
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </StrictMode>
);
