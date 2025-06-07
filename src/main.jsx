import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Telegram Web App if available
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
