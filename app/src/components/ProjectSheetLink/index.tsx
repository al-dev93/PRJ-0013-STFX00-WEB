import React, { memo, useMemo } from 'react';

import { encodePath, getUrlBase } from '@/utils/urlHelpers';

import styles from './style.module.css';
import type { ProjectSheetLinkProps } from './types';
import { PROJECT_SHEET_EXTENSION } from '../../modules/Slideshow/utils/constants';
/**
 * Renders an accessible link to the project's PDF sheet when running in "remote" mode.
 * If no `projectSheet` is provided or the app is not remote, renders `null`.
 *
 * The component:
 * - Builds the final href from environment-driven `urlBase` + `projectSheet` + PDF extension.
 * - Uses `target="_blank"` with `rel="noopener noreferrer"` for security.
 * - Adds an explicit `aria-label` to announce opening the PDF in a new tab.
 *
 * @component
 * @param {ProjectSheetLinkProps} props - the props for the ProjectSheetLink component
 * @param {string} [projectSheet] - The project sheet identifier or relative path (without extension).
 * @param {string} title - Project title used for the accessible label.
 * @param {string} [className] - Optional CSS class to style the anchor element. Defaults to "link-pdf".
 * @returns {(React.JSX.Element | null)}
 *
 * @remarks
 * - `getUrlBase()` relies on build-time environment variables (Vite).
 * - `encodePath()` is applied segment-wise to preserve slashes while encoding.
 * - The visible text is intentionally concise; the `aria-label` carries fuller context.
 */
export const ProjectSheetLink = memo(function MemoizedProjectSheetLink({
  projectSheet,
  title,
  linkLabel,
  className,
  variant,
}: ProjectSheetLinkProps): React.JSX.Element | null {
  const { isRemote, urlBase } = useMemo(() => getUrlBase(), []);

  const href = useMemo(() => {
    if (!projectSheet || !isRemote) return undefined;
    return `${urlBase}/project-sheets/${encodePath(projectSheet)}${PROJECT_SHEET_EXTENSION}`;
  }, [projectSheet, isRemote, urlBase]);

  const content = () => (
    <>
      <svg
        aria-hidden='true'
        focusable='false'
        className={styles.linkPdf__icon}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' />
        <path d='M14 3v5h5' />
        <path d='M9 13h6' />
        <path d='M9 17h6' />
      </svg>
      {linkLabel}
    </>
  );
  if (!href && variant !== 'slideshow') return null;

  return (
    // <a
    //   href={href}
    //   target='_blank'
    //   rel='noopener noreferrer'
    //   className={className ? `${styles.linkPdf} ${className}` : styles.linkPdf}
    //   data-variant={variant || undefined}
    //   aria-label={`Ouvrir la fiche projet PDF « ${title} » dans un nouvel onglet`}
    // >
    //   <svg
    //     aria-hidden='true'
    //     focusable='false'
    //     className={styles.linkPdf__icon}
    //     viewBox='0 0 24 24'
    //     fill='none'
    //     stroke='currentColor'
    //     strokeWidth='1.6'
    //     strokeLinecap='round'
    //     strokeLinejoin='round'
    //   >
    //     <path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' />
    //     <path d='M14 3v5h5' />
    //     <path d='M9 13h6' />
    //     <path d='M9 17h6' />
    //   </svg>
    //   {linkLabel}
    //   <span className='visually-hidden'> — ouvre le fichier (PDF) dans un nouvel onglet</span>
    // </a>
    variant !== 'slideshow' ? (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={className ? `${styles.linkPdf} ${className}` : styles.linkPdf}
        data-variant={variant || undefined}
        aria-hidden='true'
        // aria-label={`Ouvrir la fiche projet PDF « ${title} » dans un nouvel onglet`}
      >
        {content()}
        <span className='visually-hidden'> — ouvre la fiche projet « {title} » (PDF) dans un nouvel onglet</span>
      </a>
    ) : (
      <span
        className={className ? `${styles.linkPdf} ${className}` : styles.linkPdf}
        data-variant={variant || undefined}
        aria-hidden='true'
        // aria-label={`Ouvrir la fiche projet PDF « ${title} » dans un nouvel onglet`}
      >
        {content()}
        <span className='visually-hidden'> — lien via l&apos;image</span>
      </span>
    )
  );
});
