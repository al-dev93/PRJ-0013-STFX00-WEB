import { ApplicationError } from '@modules/Error/error';

import { CardErrorContext } from './types';

/**
 * Custom error class for invalid card display modes.
 * Provides structured error data specific to the Card component.
 *
 * @class CardDisplayError
 * @extends ApplicationError
 *
 * @example
 * throw new CardDisplayError('grid', {
 *   projectId: 'proj_123',
 *   invalidProperty: 'display'
 * });
 */
export class CardDisplayError extends ApplicationError {
  constructor(
    public displayMode: string | undefined,
    context: CardErrorContext,
  ) {
    const error = new Error();
    const stack = error.stack || 'No stack available';

    super(400, `Invalid display mode: ${displayMode}`, 'medium', {
      ...context,
      stack,
    });
    this.name = 'CardDisplayError';
  }
}
