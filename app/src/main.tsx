import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/router';
import './assets/styles/root.css';

// import './assets/styles/global.css';
// import './assets/styles/variables.css';

// Global handler for synchronous errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Uncaught global error :', { message, source, lineno, colno, error });
  return true; // Prevents error propagation to the console by default
};

// Global handler for uncaptured rejected promises
window.onunhandledrejection = (event) => {
  console.error('Promesse rejetée non capturée :', event.reason);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router()} />
  </React.StrictMode>,
);
