/**
 * Represents a standardized error structure for the application.
 * This type is used across the error handling system to ensure consistency.
 *
 * @export
 * @type {Object} AppError
 * @property {number} code - HTTP status code or custom error code
 * @property {string} message - Human-readable error description
 * @property {string} [name] - Error class name
 * @property {Record<string, unknown>} [context] - Additional error metadata
 * @property {'low' | 'medium' | 'critical'} severity - Error impact level
 * @property {unknown} [originalError] - Original error object (if available)
 * @property {number} [timestamp] - Error occurrence timestamp (automatic dans ApplicationError)
 */
export type AppError = Error & {
  code: number;
  // message: string;
  // name?: string;
  severity: 'low' | 'medium' | 'critical';
  context?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: number;
};

export type RouterError = {
  status: number;
  statusText: string;
  data?: unknown;
};

declare module 'react-router-dom' {
  interface ErrorResponse extends AppError {
    status: number;
    data: unknown;
  }
}
