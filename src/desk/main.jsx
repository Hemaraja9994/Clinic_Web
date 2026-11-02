import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import '../admin/admin.css';
import DeskApp from './DeskApp.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DeskApp />
  </React.StrictMode>,
);
