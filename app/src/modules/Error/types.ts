import { ReactNode } from 'react';

import type { AppError } from '@/types';

export type ErrorProps = {
  error?: Error;
  onReset?: () => void;
};

export type NormalizedError = AppError & {
  context?: {
    previousPath?: string;
    [key: string]: unknown;
  };
};

export type CustomError = {
  context?: {
    projectId?: string;
    invalidTag?: string;
    [key: string]: unknown;
  };
} & Error;

export type Props = {
  children: ReactNode;
  fallback?: React.ReactElement<ErrorProps>;
  onReset?: () => void;
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

export type FetchErrorContext = {
  source?: 'component' | 'router';
  component?: string;
  operation?: string;
  url: string | string[];
  method?: string;
  retryCount?: number;
  payload?: unknown;
  stack?: string;
  originalError?: unknown;
};
