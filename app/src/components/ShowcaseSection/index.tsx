import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DetailSection, MenuSectionsVisibility } from '@/types';
import { AppButton } from '@components/AppButton';
import { DynamicElement } from '@components/DynamicElement';
import type { ValidComponentTag, ValidHTMLTag } from '@components/DynamicElement/types';
import { DynamicElementContainer } from '@components/DynamicElementContainer';
import { HeroSignature } from '@components/HeroSignature';
import { useOnScreen } from '@hooks/useOnScreen';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { INTERSECTION_OPTIONS_ROOTMARGIN } from '@utils/constants';
import { renderFormattedText } from '@utils/stylizedString';

import style from './style.module.css';
import type { ShowcaseSectionProps } from './types';

const isRenderNode = (node: DetailSection) =>
  node.id &&
  node.tag &&
  (typeof node.content === 'string' || typeof node.content === 'undefined') &&
  typeof node.id === 'string' &&
  typeof node.tag === 'string';

/**
 * Renders a dynamic showcase section for anchored page content and the hero area.
 *
 * @remarks
 * - Builds the section from backend-driven content nodes while preserving semantic headings and dynamic rendering.
 * - Uses `aria-labelledby` on the root section, a stable title id, and dialog-related ARIA attributes on the contact CTA.
 * - Updates the page menu visibility state when the section is anchored and observed on screen.
 * - Exposes styling hooks through the root `data-variant` attribute and CSS module classes derived from `anchor` and node names.
 * - Handles the hero-specific brand signature, CTA readiness state, and intersection target without duplicating prop documentation.
 * - Keep runtime defaults aligned with `@defaultValue` in {@link ShowcaseSectionProps}.
 *
 * @example
 * ```tsx
 * <ShowcaseSection
 *   content={content}
 *   anchor="home"
 *   isAnchored
 *   title="Stack-Flex"
 *   introduction={introduction}
 *   MenuSectionsVisibility={menuSectionsVisibility}
 *   openModalFormDialog={openModalFormDialog}
 *   showModalFormDialog={showModalFormDialog}
 *   modalId="contact-dialog"
 * />
 * ```
 *
 * @see {@link ShowcaseSectionProps}
 */
export const ShowcaseSection = memo(function ShowcaseSection({
  content,
  anchor,
  isAnchored,
  title,
  introduction,
  MenuSectionsVisibility,
  openModalFormDialog,
  showModalFormDialog,
  modalId,
}: ShowcaseSectionProps): React.JSX.Element | null {
  const handleError = useErrorHandler();

  const isHero = anchor === 'home';
  // const isAbout = anchor === 'about';

  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasBrandSignaturePlayed, setHasBrandSignaturePlayed] = useState<boolean>(false);

  const { isIntersecting, observerError } = useOnScreen(isHero ? titleRef : sectionRef, {
    threshold: isHero ? [0.45] : undefined,
    ...INTERSECTION_OPTIONS_ROOTMARGIN,
  });

  // const [mainContent, summaryContent, skillsContent] = useMemo<
  //   [DetailSection[], DetailSection[], DetailSection[]] | [DetailSection[]]
  // >(() => {
  //   const sortContent = content.sort((a, b) => a.orderInSection - b.orderInSection);

  //   return isAbout
  //     ? sortContent.reduce(
  //         (prev: [DetailSection[], DetailSection[], DetailSection[]], curr) => {
  //           if (curr.name?.includes('description')) return [[...prev[0], curr], prev[1], prev[2]];
  //           if (curr.name?.includes('summary')) return [prev[0], [...prev[1], curr], prev[2]];
  //           return [prev[0], prev[1], [...prev[2], curr]];
  //         },
  //         [[], [], []],
  //       )
  //     : [sortContent];
  // }, [content, isAbout]);

  const buttonState = hasBrandSignaturePlayed ? 'ready' : 'pending';
  // const idSection = anchor ?? `${content}`;

  /**
   * Updates the visibility of the section in the page sections context.
   */
  useEffect(() => {
    if (!anchor || !isAnchored) return;
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
  }, [anchor, isIntersecting, MenuSectionsVisibility, observerError, handleError, isAnchored]);

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
   * Retrieves a CSS class name based on the provided DetailSection object.
   * If the name is provided, it returns a formatted class name using a predefined style.
   * If no name is provided, it returns an empty string.
   *
   * @function
   * @param {DetailSection} node - The DetailSection object representing a section.
   * @returns {string} The corresponding class name or an empty string if no node is provided.
   *
   * @al-dev93
   */
  const getElementClassName = useCallback(
    (node: DetailSection): string | undefined => {
      // if (!node.name || !['p', 'ul'].includes(node.tag)) return undefined;
      if (!node.name) return undefined;
      const { name } = node;

      if (isHero) return style[`hero__${name}`];
      if (!anchor) return style[`${name}`];
      if (anchor && name.includes('kicker')) return style[`${anchor}__kicker`];

      return style[`${anchor}__${name}`];
    },
    [anchor, isHero],
  );

  /**
   * Renders the title section with a decorative line.
   *
   * @function
   * @param {string} titleSection - The title text.
   * @returns {(React.JSX.Element | null)} The rendered section title.
   */
  const showcaseSectionTitle = useMemo((): React.JSX.Element | null => {
    if (!title) return null;
    return (
      <h2 id={`${anchor}-title`} className={style.section__titleSection}>
        <span className={style.section__titleSection__inner}>{title}</span>
      </h2>
    );
  }, [anchor, title]);

  const getHeroNodeRef = (renderNode: DetailSection): React.RefObject<HTMLParagraphElement> | undefined => {
    if (!renderNode.name || !['kicker', 'title'].includes(renderNode.name)) return undefined;
    if (renderNode.name === 'kicker') return kickerRef;
    return titleRef;
  };

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
      if (!isRenderNode(renderNode)) return null;

      return (
        <DynamicElement
          key={renderNode.id}
          id={renderNode.tag === 'h1' ? `${anchor}-title` : undefined}
          tag={renderNode.tag as ValidHTMLTag | ValidComponentTag}
          endpoint={renderNode.endpoint}
          introduction={renderNode.tag === 'Slideshow' ? introduction : undefined}
          className={getElementClassName(renderNode)}
          aria-hidden={renderNode.name === 'brand' ? 'true' : undefined}
          ref={isHero ? getHeroNodeRef(renderNode) : undefined}
        >
          {typeof renderNode.content === 'string' ? renderFormattedText(renderNode.content) : null}
          {renderNode.boldContent?.length
            ? renderNode.boldContent.map((item) => {
                return isRenderNode(item) ? (
                  <DynamicElement
                    key={item.id}
                    tag={item.tag as ValidHTMLTag | ValidComponentTag}
                    className={getElementClassName(item)}
                  >
                    {typeof item.content === 'string' ? renderFormattedText(item.content) : null}
                  </DynamicElement>
                ) : null;
              })
            : null}
        </DynamicElement>
      );
    },
    [anchor, getElementClassName, introduction, isHero],
  );

  const renderSectionContent = (): (React.JSX.Element | null)[] =>
    content.map((renderNode: DetailSection) =>
      renderNode.wrapped ? (
        <DynamicElementContainer
          key={renderNode.id}
          tag={renderNode.tag as ValidHTMLTag | ValidComponentTag}
          className={getElementClassName(renderNode)}
          // filterValue='card'
          endpoint={renderNode.endpoint}
          method='POST'
        />
      ) : (
        renderDynamicElement(renderNode)
      ),
    );

  // const renderAboutSectionContent = (): React.JSX.Element | null => {
  //   console.log(skillsContent);
  //   return (
  //     <>
  //       <div className={style.about__layout}>
  //         <div className={style.about__content}>
  //           {mainContent.map((renderNode) => renderDynamicElement(renderNode))}
  //         </div>
  //         <aside className={style.summary}>
  //           <div className={style.summary__inner}>
  //             {summaryContent?.map((renderNode) => renderDynamicElement(renderNode))}
  //             <AppButton
  //               className={style.about__summary__cta}
  //               variant='outline'
  //               state='ready'
  //               name='Parlons de votre projet'
  //               onClick={openModalFormDialog}
  //               ariaExpanded={showModalFormDialog}
  //               ariaHasPopup='dialog'
  //               ariaControls={modalId}
  //             />
  //           </div>
  //         </aside>
  //       </div>
  //       {skillsContent?.map((renderNode) => renderDynamicElement(renderNode))}
  //     </>
  //   );
  // };

  return (
    <section
      className={style.section}
      data-variant={anchor ? `${anchor}` : undefined}
      ref={sectionRef}
      id={isAnchored ? anchor : undefined}
      tabIndex={-1}
      aria-labelledby={`${anchor}-title`}
    >
      <div className={style.section__bodySection}>
        {title ? (
          <header className={style[`${anchor}__header`]}>
            {showcaseSectionTitle}
            {/* {anchor === 'work' ? <p className={style.work__header__intro}>4 projets clés</p> : null} */}
          </header>
        ) : null}

        {renderSectionContent()}
      </div>
      <AppButton
        // className={style.section__button}
        name={isHero ? 'Parlons de votre projet' : 'Me contacter'}
        variant={isHero ? 'hero' : undefined}
        state={isHero ? buttonState : undefined}
        onClick={openModalFormDialog}
        ariaExpanded={showModalFormDialog}
        ariaHasPopup='dialog'
        ariaControls={modalId}
        ref={isHero ? buttonRef : undefined}
      />
      {isHero ? (
        <div className={style.hero__signature}>
          <HeroSignature setHasBrandSignaturePlayed={setHasBrandSignaturePlayed} />
        </div>
      ) : null}
    </section>
  );
});
