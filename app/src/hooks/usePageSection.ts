import { useOutletContext } from 'react-router-dom';

import type { OutletContextPage } from '@/types/index.ts';

/**
 *
 * @description for TypeScript, React-router recommend the parent component provide a custom hook
 * for accessing the context value.
 * @export
 * @return {*}  {OutletContextPage}
 */
export function usePageSection(): OutletContextPage {
  return useOutletContext<OutletContextPage>();
}
