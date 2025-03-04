import type { AppError } from '@/types';

/**
 * Class representing a standardized application error.
 * Implements the AppError interface and extends native Error.
 *
 * @export
 * @class ApplicationError
 * @extends {Error}
 * @implements {AppError}
 *
 * @param {number} code - HTTP status code or custom error code
 * @param {string} message - Human-readable error description
 * @param {'low' | 'medium' | 'critical'} severity - Error impact level
 * @param {Record<string, unknown>} [context] - Additional error metadata
 * @param {unknown} [originalError] - Original error object (optional)

 */
export class ApplicationError extends Error implements AppError {
  timestamp: number;

  originalError?: unknown;

  constructor(
    public code: number,
    message: string,
    public severity: AppError['severity'],
    public context?: Record<string, unknown>,
    originalError?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
    this.timestamp = Date.now();
  }

  /**
   * Converts the error instance to a plain AppError object
   *
   * @returns {AppError} Standardized error representation
   */
  toPlainObject(): AppError {
    return {
      ...this,
      // code: this.code,
      message: this.message,
      name: this.name,
      // severity: this.severity,
      // context: this.context,
      // originalError: this.originalError,
      // timestamp: this.timestamp,
    };
  }
}
