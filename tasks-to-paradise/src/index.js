  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import './css/index.css';
  import App from './core/App';
  import reportWebVitals from './core/reportWebVitals';
  import 'bootstrap/dist/css/bootstrap.min.css'; //add this line only in this file
  import { ChakraProvider } from '@chakra-ui/react';
  import theme from './core/theme'

  


  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <ChakraProvider theme={theme}>

      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChakraProvider>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
