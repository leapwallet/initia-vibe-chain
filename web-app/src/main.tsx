import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { StrictMode } from 'react';

import { ThemeProvider } from './components/theme/index.tsx';
import './index.css';
import InterwovenProvider from './providers/interwoven-provider';
import { QueryProvider } from './providers/query-provider';
import { router } from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <InterwovenProvider>
          <RouterProvider router={router} />
        </InterwovenProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
