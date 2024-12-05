import React, { memo, useEffect, useRef } from 'react';

import { ModalFormButton } from '@components/ModalFormButton';
import { useOnScreen } from '@hooks/useOnScreen';
import titleLine from '@images/decorations/title_line.svg';
import { INTERSECTION_OPTIONS_ROOTMARGIN } from '@utils/constants';

import style from './style.module.css';
import { DynamicElement } from '../DynamicElement';
import { DynamicElementContainer } from '../DynamicElementContainer';

import type { ShowcaseSectionProps } from './types';
import type { ComponentType } from '../DynamicElement/types';
import type { MenuSectionsVisibility } from '@/types';

/**
 * Retrieves a CSS class name based on the provided node string.
 * If the node is provided, it returns a formatted class name using a predefined style.
 * If no node is provided, it returns an empty string.
 *
 * @param {string} [node] - The optional string representing a section or element identifier.
 * @returns {string} The corresponding class name or an empty string if no node is provided.
 *
 * @al-dev93
 */
function getElementClassName(node?: string): string {
  return node ? node && style[`section__${node}`] : '';
}

/**
 * ShowcaseSection component that displays a section with dynamic content and a modal form button.
 *
 * @component
 * @param {ShowcaseSectionProps} props - The properties for the ShowcaseSection component.
 * @property {DetailSection[]} content - Data to produce the content of the section.
 * @property {SectionsRef} [anchor] - Name of the Id assigned to the section.
 * @property {string} [title] - Section title.
 * @property {MutableRefObject<MenuSectionsVisibility>} MenuSectionsVisibility - Indicates the name of the visible displayed.
 * @property {() => void} [openModalFormDialog] - Trigger for opening the contact modal to use button in the section.
 * @property {boolean} showModalForm - The current state of the contact form dialog.
 * @property {string} modalId - The id of the modal.
 * @returns {React.JSX.Element} The rendered Tag component.
 *
 * @al-dev93
 */
function MemoizedShowcaseSection({
  content,
  anchor,
  title,
  MenuSectionsVisibility,
  openModalFormDialog,
  showModalFormDialog,
  modalId,
}: ShowcaseSectionProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const isRefDisplayed = useOnScreen(sectionRef, INTERSECTION_OPTIONS_ROOTMARGIN);

  /**
   * Updates the visibility of the section in the page sections context.
   */
  useEffect(() => {
    const section = MenuSectionsVisibility;
    if (!anchor) return;
    (section.current as MenuSectionsVisibility)[anchor as keyof MenuSectionsVisibility] = isRefDisplayed;
  }, [anchor, isRefDisplayed, MenuSectionsVisibility]);

  /**
   * Renders the title section with a decorative line.
   *
   * @function
   * @param {string} titleSection - The title text.
   * @returns {JSX.Element} The rendered section title.
   */
  const showcaseSectionTitle = (titleSection: string): JSX.Element => {
    return (
      <div className={style.section__titleSection}>
        <h2 id={`${anchor}-title`} aria-live='polite'>
          {titleSection}
        </h2>
        <img src={titleLine} alt='' aria-label='Decorative line' />
      </div>
    );
  };

  return (
    <section
      className={style.section + (!title ? ` ${style['section--hero']}` : '')}
      ref={sectionRef}
      id={anchor}
      tabIndex={-1}
      aria-labelledby={`${anchor}-title`}
    >
      <div className={style.section__bodySection}>
        {title ? showcaseSectionTitle(title) : null}
        {content.map((renderNode) =>
          !renderNode.wrapped ? (
            <DynamicElement // TODO: add comment
              key={renderNode.id}
              id={renderNode.tag === 'h1' ? `${anchor}-title` : undefined}
              tag={renderNode.tag as keyof React.JSX.IntrinsicElements | ComponentType}
              url={renderNode.urlContent}
              className={getElementClassName(renderNode.name)}
            >
              {renderNode.content}
              {renderNode.boldContent?.length
                ? renderNode.boldContent.map((item) => (
                    <DynamicElement
                      key={item.id}
                      tag={item.tag as keyof React.JSX.IntrinsicElements | ComponentType}
                      className={getElementClassName(item.name)}
                    >
                      {item.content}
                    </DynamicElement>
                  ))
                : null}
            </DynamicElement>
          ) : (
            <DynamicElementContainer
              key={renderNode.id}
              tag={renderNode.tag as keyof React.JSX.IntrinsicElements | ComponentType}
              className={getElementClassName(renderNode.name)}
              filterValue='card'
              url='http://localhost:5173/api/projects' // TODO: variable d'environnement
            />
          ),
        )}
      </div>
      <ModalFormButton
        name='Contact'
        onClick={openModalFormDialog}
        ariaLabel='Open contact form'
        ariaExpanded={showModalFormDialog}
        ariaHasPopup='dialog'
        ariaControls={modalId}
      />
    </section>
  );
}

export const ShowcaseSection = memo(MemoizedShowcaseSection);
