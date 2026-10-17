/* eslint-disable no-console */

import { IS_DEV } from 'config-global';

export function logError(error: any, info: { componentStack?: string | null }) {
  if (IS_DEV) {
    console.log('Caught error:', error);
    console.log('Error details:', info);
  } else {
    // Log error to an external service in production
  }
}
