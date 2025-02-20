import type { ErrorProps } from '@modules/Error/types';

/**
 * Displays detailed error information including error code, message,
 * and technical details (in development environment)
 *
 * @component
 * @param {Object} props - Component props
 * @param {AppError} [props.error] - Normalized error object containing error details
 *
 * @example
 * <ErrorDetail error={normalizedError} />
 *
 * @example
 * NOTE: In error boundary fallback
 * <DefaultFallback>
 *   <ErrorDetail error={error} />
 *   <RecoveryActions />
 * </DefaultFallback>
 */
export function ErrorDetail({ error }: ErrorProps): React.JSX.Element {
  return (
    <div className='error-detail'>
      {error?.code && <p>Code : {error.code}</p>}
      <p>{error?.message}</p>
      {!!error?.context?.originalError && (
        <p className='technical-detail'>Détail technique : {String(error.context.originalError)}</p>
      )}
    </div>
  );
}
