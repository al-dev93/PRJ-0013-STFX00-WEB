import type { CustomError, ErrorProps } from '@modules/Error/types';

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
  const isCustomError = (e?: Error): e is CustomError => {
    return !!e && 'context' in e;
  };

  return (
    <div className='error-detail'>
      {isCustomError(error) && error.context?.projectId && <p>Project ID: {error?.context?.projectId as string}</p>}
      {isCustomError(error) && error.context?.invalidTag && <p>Invalid Tag: {error?.context?.invalidTag as string}</p>}
    </div>
  );
}
