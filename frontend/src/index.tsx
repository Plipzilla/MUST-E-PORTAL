import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Temporarily disable StrictMode to prevent double renders that can cause page refreshes during debugging
// StrictMode in development can cause components to mount/unmount twice, leading to refresh-like behavior
root.render(
  <App />
);
