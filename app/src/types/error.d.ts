export type AppError = {
  code: number;
  message: string;
  context?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'critical';
  originalError?: unknown;
  timestamp?: number;
};

export type RouterError = {
  status: number;
  statusText: string;
  data?: unknown; // Optionnel, selon votre cas d'usage
};

declare module 'react-router-dom' {
  interface ErrorResponse extends AppError {
    status: number;
    data: unknown;
  }
}
