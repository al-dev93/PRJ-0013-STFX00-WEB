import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import type { MenuSectionsVisibility } from '@/types';
import { AppButton } from '@components/AppButton';
import { HeroSignature } from '@components/HeroSignature';
import { useOnScreen } from '@hooks/useOnScreen';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { INTERSECTION_OPTIONS_ROOTMARGIN } from '@utils/constants';
import { renderFormattedText } from '@utils/stylizedString';

import style from './style.module.css';
import type { ShowcaseSectionProps } from './types';
import { TWO_COLUMN_SHOWCASE_SECTION } from './utils/constants';
import { getShowcaseSectionColumn } from './utils/layoutDesign';
import { renderSectionContent } from './utils/renderSectionContent';

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
  detailSections,
  anchor,
  isAnchored,
  hasSectionHeader,
  title,
  introduction,
  MenuSectionsVisibility,
  openModalFormDialog,
  showModalFormDialog,
  modalId,
}: ShowcaseSectionProps): React.JSX.Element | null {
  const handleError = useErrorHandler();

  const isHero = anchor === 'home';

  const sectionRef = useRef<HTMLElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasBrandSignaturePlayed, setHasBrandSignaturePlayed] = useState<boolean>(false);

  const intersectionOptions = useMemo<IntersectionObserverInit>(
    () => ({
      threshold: isHero ? [0.45] : undefined,
      ...INTERSECTION_OPTIONS_ROOTMARGIN,
    }),
    [isHero],
  );

  const { isIntersecting, observerError } = useOnScreen(isHero ? titleRef : sectionRef, intersectionOptions);

  const buttonState = hasBrandSignaturePlayed ? 'ready' : 'pending';

  const { main, secondary = [] } =
    anchor && TWO_COLUMN_SHOWCASE_SECTION.includes(anchor)
      ? getShowcaseSectionColumn(detailSections)
      : { main: detailSections };

  /**
   * Updates the visibility of the section in the page sections context.
   */
  useEffect(() => {
    if (!anchor || !isAnchored) return;
    if (observerError) {
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

  return (
    <section
      className={style.section}
      data-variant={anchor ? `${anchor}` : undefined}
      ref={sectionRef}
      id={isAnchored ? anchor : undefined}
      tabIndex={-1}
      aria-labelledby={`${anchor}-title`}
    >
      <div className={style.section__mainColumn}>
        {hasSectionHeader ? (
          <header className={style.section__header}>
            {title ? showcaseSectionTitle : null}
            {introduction ? <p>{renderFormattedText(introduction)}</p> : null}
          </header>
        ) : null}
        {detailSections && detailSections.length > 0
          ? renderSectionContent(main, { anchor, style, isHero, kickerRef, titleRef })
          : null}
      </div>
      {secondary.length ? (
        <div className={style.section__secondaryColumn}>
          {renderSectionContent(secondary, { anchor, style, isHero, kickerRef, titleRef })}
        </div>
      ) : null}
      <footer className={style.section__footer}>
        <AppButton
          name={isHero ? 'Parlons de votre projet' : 'Me contacter'}
          variant={isHero ? 'hero' : undefined}
          state={isHero ? buttonState : undefined}
          onClick={openModalFormDialog}
          ariaExpanded={showModalFormDialog}
          ariaHasPopup='dialog'
          ariaControls={modalId}
          ref={isHero ? buttonRef : undefined}
        />
      </footer>
      {isHero ? (
        <div className={style.hero__signature}>
          <HeroSignature setHasBrandSignaturePlayed={setHasBrandSignaturePlayed} />
        </div>
      ) : null}
    </section>
  );
});
