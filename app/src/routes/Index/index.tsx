import React, { useMemo } from 'react';

import type { IndexPageSection } from '@/types';
import { isArrayOfType } from '@/utils/typeHelpers';
import { ShowcaseSection } from '@components/ShowcaseSection';
import { useFetchData } from '@hooks/useFetchData';
import { usePageSection } from '@hooks/usePageSection';

import { optionalIndexSchema, requiredIndexSchema } from './indexSchema';
import style from './style.module.css';

/**
 *
 * @description home page content inserted into the layout
 * @export
 * @return {React.JSX.Element}
 * @al-dev93
 */
export function Index(): React.JSX.Element | null {
  /**
   * Initializes the page section context and contact form dialog state.
   *
   * @constant {MutableRefObject<MenuSectionsVisibility>} viewSectionContext - The context object for the page sections.
   * @constant {SetStateBoolean} setOpenContactFormDialog - The function to set the state of the contact form dialog.
   * @constant {boolean} openContactFormDialog - The state of the contact form dialog.
   * @constant {string} modalId - The id of the modal.
   */
  const { viewSectionContext, setOpenContactFormDialog, openContactFormDialog, modalId } = usePageSection();

  const endpoint = import.meta.env.VITE_API_SHOWCASES_DATA_ENDPOINT;
  /**
   * Fetches data from the server using the useFetchData hook.
   *
   * @constant {Object} data - The data fetched from the server.
   */
  const { data } = useFetchData({ endpoint, initialOptions: { method: 'POST' } });

  /**
   * Memoized and sorted list of page sections.
   *
   * @remarks
   * - Validates that `data` is a non-null array of `IndexPageSection` before sorting.
   * - Returns `undefined` if `data` is missing or fails the schema check.
   * - Sorts by the numeric `order` property in ascending order.
   *
   * @type {IndexPageSection[] | undefined}
   */
  const sortedAndValidatedData = useMemo<IndexPageSection[] | undefined>(() => {
    // Only sort if we actually have data and it passes our runtime guard
    if (data && isArrayOfType<IndexPageSection>(data, requiredIndexSchema, optionalIndexSchema)) {
      // Clone + sort to avoid mutating the original array
      return [...data].sort((a, b) => a.order - b.order);
    }
    // Fallback: either no data yet or invalid data shape
    return undefined;
  }, [data]);

  /**
   * Handles the click event to open or close the contact form dialog.
   *
   * @function
   * @returns {void}
   */
  const handleClick = (): void => setOpenContactFormDialog((formState) => !formState);

  return sortedAndValidatedData ? (
    <div className={style.wrapperIndex}>
      {sortedAndValidatedData.map(({ id, content, anchor, title }) => (
        <ShowcaseSection
          key={id}
          content={content}
          anchor={anchor}
          title={title}
          MenuSectionsVisibility={viewSectionContext}
          openModalFormDialog={handleClick}
          showModalFormDialog={openContactFormDialog}
          modalId={modalId}
        />
      ))}
    </div>
  ) : null;
}
