import type { ErrorProps } from '../../types';

/**
 * Description placeholder
 *
 * @export
 * @param {ErrorProps} param0
 * @param {ErrorProps} param0.error
 * @returns {React.JSX.Element}
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
