import React from 'react';

import { ShowcaseSection } from '@components/ShowcaseSection';
import { useFetchData } from '@hooks/useFetchData';
import { usePageSection } from '@hooks/usePageSection';

import style from './style.module.css';

import type { IndexPageSection } from '@/types';

/**
 *
 * @description home page content inserted into the layout
 * @export
 * @return {React.JSX.Element}
 * @al-dev93
 */
export function Index(): React.JSX.Element {
  /**
   * Initializes the page section context and contact form dialog state.
   *
   * @constant {MutableRefObject<MenuSectionsVisibility>} viewSectionContext - The context object for the page sections.
   * @constant {SetStateBoolean} setOpenContactFormDialog - The function to set the state of the contact form dialog.
   * @constant {boolean} openContactFormDialog - The state of the contact form dialog.
   * @constant {string} modalId - The id of the modal.
   */
  const { viewSectionContext, setOpenContactFormDialog, openContactFormDialog, modalId } = usePageSection();

  /**
   * Fetches data from the server using the useFetchData hook.
   *
   * @constant {Object} data - The data fetched from the server.
   */
  const { data } = useFetchData('http://localhost:5173/api/showcaseSections', { method: 'GET' });

  /**
   * Handles the click event to open or close the contact form dialog.
   *
   * @function
   * @returns {void}
   */
  const handleClick = (): void => setOpenContactFormDialog((formState) => !formState);

  return (
    <div className={style.wrapperIndex}>
      {(data as IndexPageSection[])?.map(({ id, content, anchor, title }) => (
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
  );
}
