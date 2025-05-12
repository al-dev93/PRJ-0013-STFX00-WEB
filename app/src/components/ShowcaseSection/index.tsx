import React, { memo, useCallback, useEffect, useRef } from 'react';

import type { DetailSection, MenuSectionsVisibility } from '@/types';
import { ModalFormButton } from '@components/ModalFormButton';
import { useOnScreen } from '@hooks/useOnScreen';
import titleLine from '@images/decorations/title_line.svg';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { INTERSECTION_OPTIONS_ROOTMARGIN } from '@utils/constants';

import style from './style.module.css';
import type { ShowcaseSectionProps } from './types';
import { DynamicElement } from '../DynamicElement';
import type { ValidComponentTag, ValidHTMLTag } from '../DynamicElement/types';
import { DynamicElementContainer } from '../DynamicElementContainer';

/**
 * ShowcaseSection component that displays a section with dynamic content and a modal form button.
 *
 * @component
 * @param {ShowcaseSectionProps} props - The properties for the ShowcaseSection component.
 * @property {DetailSection[]} content - Data to produce the content of the section.
 * @property {SectionsRef} [anchor] - Name of the Id assigned to the section.
 * @property {string} [title] - Section title.
 * @property {MutableRefObject<MenuSectionsVisibility>} MenuSectionsVisibility - Indicates the name of the visible displayed.
 * @property {function} [openModalFormDialog] - Trigger for opening the contact modal to use button in the section.
 * @property {boolean} showModalFormDialog - The current state of the contact form dialog.
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
}: ShowcaseSectionProps): React.JSX.Element | null {
  const handleError = useErrorHandler();
  const sectionRef = useRef<HTMLElement>(null);
  const { isIntersecting, observerError } = useOnScreen(sectionRef, INTERSECTION_OPTIONS_ROOTMARGIN);

  /**
   * Updates the visibility of the section in the page sections context.
   */
  useEffect(() => {
    if (!anchor) return;
    if (observerError) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(observerError.code, observerError.message, {
          ...observerError.context,
          component: 'ShowcaseSection',
          operation: 'setupObserver',
          category: 'UI Interaction',
          url: window.location.href,
        }),
      );
      return;
    }
    const section = MenuSectionsVisibility;
    (section.current as MenuSectionsVisibility)[anchor as keyof MenuSectionsVisibility] = isIntersecting;
  }, [anchor, isIntersecting, MenuSectionsVisibility, observerError, handleError]);

  /**
   * Handling errors in props.
   */
  useEffect(() => {
    // Verification of mandatory data
    if (!content || content.length === 0) {
      // eslint-disable-next-line no-void
      void handleError(
        createError(1001, 'Invalid content: No data provided', {
          url: window.location.href,
          component: 'ShowcaseSection',
          invalidProperty: 'content',
          operation: 'render',
          category: 'UI Component',
        }),
      );
      return;
    }

    content.forEach((renderNode) => {
      // Checking required properties of child node
      if (!renderNode.id || !renderNode.tag) {
        // eslint-disable-next-line no-void
        void handleError(
          createError(1001, `Missing required properties in node ${renderNode.id}`, {
            url: window.location.href,
            component: 'ShowcaseSection',
            invalidProperty: 'content',
            invalidNodeId: renderNode.id,
            operation: 'render',
            category: 'UI Component',
          }),
        );
      }
      // Checking the type of the essential data of the child node
      if (
        typeof renderNode.id !== 'string' ||
        typeof renderNode.tag !== 'string' ||
        (typeof renderNode.content !== 'string' && typeof renderNode.content !== 'undefined')
      ) {
        // eslint-disable-next-line no-void
        void handleError(
          createError(1002, `Invalid data types in node ${renderNode.id}`, {
            url: window.location.href,
            component: 'ShowcaseSection',
            invalidProperty: 'content',
            invalidNodeId: renderNode.id,
            operation: 'render',
            category: 'UI Component',
          }),
        );
      }
    });
  }, [content, handleError]);

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
  const getElementClassName = (node?: string): string => (node ? style[`section__${node}`] : '');

  /**
   * Renders the title section with a decorative line.
   *
   * @function
   * @param {string} titleSection - The title text.
   * @returns {(React.JSX.Element | null)} The rendered section title.
   */
  const showcaseSectionTitle = useCallback(
    (titleSection: string | undefined): React.JSX.Element | null => {
      return titleSection ? (
        <div className={style.section__titleSection}>
          <h2 id={`${anchor}-title`} aria-live='polite'>
            {titleSection}
          </h2>
          <img src={titleLine} alt='Decorative line' />
        </div>
      ) : null;
    },
    [anchor],
  );

  /**
   * Renders the DynamicElement bloc. If the definition data is missing,
   * returns null.
   *
   * @function
   * @param {DetailSection} renderNode - DynamicElement bloc definition data
   * @returns {(React.JSX.Element | null)}
   */
  const renderDynamicElement = useCallback(
    (renderNode: DetailSection): React.JSX.Element | null => {
      const isRenderNode = (node: DetailSection) =>
        node.id &&
        node.tag &&
        (typeof node.content === 'string' || typeof node.content === 'undefined') &&
        typeof node.id === 'string' &&
        typeof node.tag === 'string';

      return isRenderNode(renderNode) ? (
        <DynamicElement
          key={renderNode.id}
          id={renderNode.tag === 'h1' ? `${anchor}-title` : undefined}
          tag={renderNode.tag as ValidHTMLTag | ValidComponentTag}
          endpoint={renderNode.endpoint}
          className={getElementClassName(renderNode.name)}
        >
          {renderNode.content}
          {renderNode.boldContent?.length
            ? renderNode.boldContent.map((item) => {
                return isRenderNode(item) ? (
                  <DynamicElement
                    key={item.id}
                    tag={item.tag as ValidHTMLTag | ValidComponentTag}
                    className={getElementClassName(item.name)}
                  >
                    {item.content}
                  </DynamicElement>
                ) : null;
              })
            : null}
        </DynamicElement>
      ) : null;
    },
    [anchor],
  );

  return (
    <section
      className={style.section + (!title ? ` ${style['section--hero']}` : '')}
      ref={sectionRef}
      id={anchor}
      tabIndex={-1}
      aria-labelledby={`${anchor}-title`}
    >
      <div className={style.section__bodySection}>
        {showcaseSectionTitle(title)}
        {content.map((renderNode) =>
          !renderNode.wrapped ? (
            renderDynamicElement(renderNode)
          ) : (
            <DynamicElementContainer
              key={renderNode.id}
              tag={renderNode.tag as ValidHTMLTag | ValidComponentTag}
              className={getElementClassName(renderNode.name)}
              filterValue='card'
              endpoint={renderNode.endpoint}
              method='POST'
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
