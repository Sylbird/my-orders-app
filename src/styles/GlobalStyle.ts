import { createGlobalStyle } from 'styled-components';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

const GlobalStyle = createGlobalStyle`
:root{
  --app-border-radius: 6px;
}

.p-datatable{
  border-radius: var(--app-border-radius);
  overflow: auto;
}
`;

export default GlobalStyle;
