import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import { createGlobalStyle } from 'styled-components';
import reportWebVitals from './reportWebVitals';

import './index.css'

const Global = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}`

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/*// <React.StrictMode>*/}
      <Global />
      <App />
    {/*// </React.StrictMode>*/}
  </>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
