import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import { providers } from '@/app/providers';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {providers(<App />)}
  </React.StrictMode>
);
