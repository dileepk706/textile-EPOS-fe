import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import { HelmetProvider } from 'react-helmet-async';

//
import { QueryClientProvider } from '@tanstack/react-query';
import App from './app/App';
import { queryClient } from 'shared/queryClient';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <App />
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>
);
