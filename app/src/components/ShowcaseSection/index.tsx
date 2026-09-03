import React, { memo, useMemo } from 'react';

import { AppButton } from '@components/AppButton';
import { HeroSignature } from '@components/HeroSignature';
import { renderFormattedText } from '@utils/stylizedString';

import style from './style.module.css';
import type { ShowcaseSectionProps } from './types';
import { getShowcaseSectionColumn } from './utils/layoutDesign';
import { renderSectionContent } from './utils/renderSectionContent';

const TWO_COLUMN_SHOWCASE_SECTION = ['about'];
/**
 * Renders a dynamic showcase section for anchored page content and the hero area.
 *
 * @remarks
 * - Builds the section from backend-driven content nodes while preserving semantic headings and dynamic rendering.
 * - Uses `aria-labelledby` on the root section, a stable title id, and dialog-related ARIA attributes on the contact CTA.
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
  openModalFormDialog,
  showModalFormDialog,
  modalId,
}: ShowcaseSectionProps): React.JSX.Element | null {
  const isHero = anchor === 'home';

  const { main, secondary = [] } =
    anchor && TWO_COLUMN_SHOWCASE_SECTION.includes(anchor)
      ? getShowcaseSectionColumn(detailSections)
      : { main: detailSections };

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
          ? // ? renderSectionContent(main, { anchor, style, isHero, kickerRef, titleRef })
            renderSectionContent(main, { anchor, style, isHero })
          : null}
      </div>
      {secondary.length ? (
        <div className={style.section__secondaryColumn}>
          {renderSectionContent(secondary, { anchor, style, isHero })}
        </div>
      ) : null}
      <footer className={style.section__footer}>
        <AppButton
          name={isHero ? 'Parlons de votre projet' : 'Me contacter'}
          onClick={openModalFormDialog}
          ariaExpanded={showModalFormDialog}
          ariaHasPopup='dialog'
          ariaControls={modalId}
        />
      </footer>
      {isHero ? (
        <div className={style.hero__signature}>
          <HeroSignature />
        </div>
      ) : null}
    </section>
  );
});
