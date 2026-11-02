import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import AdminApp from './AdminApp.jsx';
import './admin.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <AdminApp />
    </MotionConfig>
  </React.StrictMode>,
);
