import { ApplicationError } from '@modules/Error/error';

import type { DynamicElementErrorContext } from './types';

export class DynamicElementError extends ApplicationError {
  constructor(context: DynamicElementErrorContext) {
    const stack = new Error().stack || 'No stack available';

    super(422, `Invalid tag: ${context.invalidTag}`, 'medium', {
      ...context,
      stack,
    });

    this.name = 'DynamicElementError';
  }
}
