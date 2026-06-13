import React from 'react';

import { isIndexPageSectionArray } from '@/utils/typeHelpers';
import { ShowcaseSection } from '@components/ShowcaseSection';
import { useFetchData } from '@hooks/useFetchData';
import { usePageSection } from '@hooks/usePageSection';

import style from './style.module.css';

// const test = [
//   {
//     id: 'aaa',
//     anchor: 'home',
//     title: 'test-titre',
//     introduction: 'introduction de test',
//     order: 1,
//     isAnchored: true,
//     detailSections: [
//       {
//         id: 'aa0-001',
//         blockKey: 'block de test',
//         tag: 'div',
//         tagKind: 'html',
//         // 'variant' : ,
//         wrapped: false,
//         name: 'titre du test',
//         // 'content' : ,
//         // 'sectionIntroduction' : ,
//         // 'endpoint' : ,
//         // 'iconName' : ,
//         orderInSection: 1,
//         isVisible: true,
//         items: [
//           {
//             id: 'aa0-001-001',
//             itemKey: 'item de test',
//             tag: 'p',
//             tagKind: 'html',
//             // 'variant' : ,
//             wrapped: false,
//             // 'name' : ,
//             content: "contenu de l'item de test",
//             // 'endpoint' : ,
//             iconName: 'logo-github',
//             orderInBlock: 1,
//             isVisible: true,
//           },
//         ],
//       },
//     ],
//   },
// ];

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
  const { data } = useFetchData({ endpoint, method: 'POST' });
  const isValidData = isIndexPageSectionArray(data);

  /**
   * Handles the click event to open or close the contact form dialog.
   *
   * @function
   * @returns {void}
   */
  const handleClick = (): void => setOpenContactFormDialog((formState) => !formState);

  return isValidData ? (
    <div className={style.wrapperIndex}>
      {data.map(({ id, detailSections, anchor, isAnchored, title, introduction }) => (
        <ShowcaseSection
          key={id}
          detailSections={detailSections}
          anchor={anchor}
          isAnchored={isAnchored}
          title={title}
          introduction={introduction}
          MenuSectionsVisibility={viewSectionContext}
          openModalFormDialog={handleClick}
          showModalFormDialog={openContactFormDialog}
          modalId={modalId}
        />
      ))}
    </div>
  ) : null;
}
