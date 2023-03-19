import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import {Web3Provider} from "./contexts/Web3Context";
import {AppProvider} from "./contexts/AppContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Web3Provider>
    <AppProvider>
      <React.StrictMode>
        <App/>
      </React.StrictMode>
    </AppProvider>
  </Web3Provider>
);

