import type { AppError } from '@/types';

/**
 * Simplified version before developing this feature
 *
 * @constant monitoringService
 * @type {{ track: (error: AppError, context?: Record<string, unknown>) => void; }}
 */
export const monitoringService: { track: (error: AppError, context?: Record<string, unknown>) => void } = {
  track: (error: AppError, context?: Record<string, unknown>) => {
    console.error('Error tracked:', error, context);
  },
};
