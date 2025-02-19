import { ReactNode } from 'react';

import type { AppError } from '@/types';

export type ErrorProps = {
  error?: AppError;
};

export type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export type State = {
  hasError: boolean;
  error?: AppError;
};

export interface Window {
  monitoring?: {
    captureException: (error: unknown, context?: Record<string, unknown>) => void;
  };
}
