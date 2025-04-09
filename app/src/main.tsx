import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/router';
import { encryptEmail, generateKey } from '@secure/mockedEncryption';

import './assets/styles/global.css';
import './assets/styles/variables.css';
import { makeServer } from './services/miragejs/server';

// Gestionnaire global pour les erreurs synchrones
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Erreur globale non capturée :', { message, source, lineno, colno, error });
  return true; // Empêche la propagation de l'erreur à la console par défaut
};

// Gestionnaire global pour les promesses rejetées non capturées
window.onunhandledrejection = (event) => {
  console.error('Promesse rejetée non capturée :', event.reason);
};

let key: CryptoKey | undefined;
if (process.env.NODE_ENV === 'development') {
  key = await generateKey();
  const encryptedEmail = await encryptEmail('larose.alain@gmail.com', key);
  makeServer(encryptedEmail);
}
// TODO: À commenter
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router(key)} />
  </React.StrictMode>,
);
