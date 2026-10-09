import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import { ThemeProvider } from './context/ThemeContext';
import { AppRouter, RootErrorBoundary } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);

