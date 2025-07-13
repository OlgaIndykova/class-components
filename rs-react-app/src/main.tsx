import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';
import ErrorBoundary from './Error-boundary.tsx';

const root = document.getElementById('root') as HTMLDivElement;

createRoot(root).render(
  <ErrorBoundary>
    <StrictMode>
      <App />
    </StrictMode>
  </ErrorBoundary>
);