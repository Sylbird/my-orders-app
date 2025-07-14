import { createGlobalStyle } from 'styled-components';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

const GlobalStyle = createGlobalStyle`
  body {
  height: 100vh;
  width: 100vw;
  }
`;

export default GlobalStyle;
