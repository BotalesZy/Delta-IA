// src/index.js (o src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Importante
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* El secreto es que BrowserRouter envuelve a App por fuera. 
        Así, cuando App carga en la primera línea, ya tiene el contexto activo */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);