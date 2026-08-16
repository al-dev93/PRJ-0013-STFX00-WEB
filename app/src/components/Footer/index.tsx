import React from 'react';
import { NavLink } from 'react-router-dom';

import style from './style.module.css';
import type { FooterProps } from './types';

/**
 * Provides the structural and visual closing area of the website.
 *
 * @remarks
 * The footer exposes secondary navigation and social links while remaining
 * independent from the fixed page-level social navigation.
 *
 * @returns The responsive site footer.
 */
export function Footer({ onOpenContactForm, isContactFormOpen, contactFormId }: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={style.footer}>
      <div className={style.footer__container}>
        <div className={style.footer__main}>
          <div className={style.footer__brand}>
            <span className={style.footer__brandName}>Stack-Flex</span>

            <p className={style.footer__baseline}>Design accessible & performant</p>
          </div>

          <nav className={style.footer__secondaryNav} aria-label='Navigation secondaire'>
            <ul className={style.footer__secondaryList}>
              <li>
                <button
                  className={`${style.footer__secondaryLink} ${style.footer__contactButton}`}
                  type='button'
                  onClick={onOpenContactForm}
                  aria-haspopup='dialog'
                  aria-expanded={isContactFormOpen}
                  aria-controls={contactFormId}
                >
                  Me contacter
                </button>
              </li>

              <li>
                <NavLink className={style.footer__secondaryLink} to='/legal-notice'>
                  Mentions légales
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className={style.footer__meta}>
          <p className={style.footer__copyright}>© {currentYear} AlgoNetDesign</p>
        </div>
      </div>
    </footer>
  );
}
