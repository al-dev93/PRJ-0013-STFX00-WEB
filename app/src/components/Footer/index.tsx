import React from 'react';

import style from './style.module.css';

/**
 * Provides the structural and visual closing area of the website.
 *
 * @remarks
 * Secondary navigation and social links are added separately so the footer
 * structure remains independent from page-level navigation components.
 *
 * @returns The responsive site footer.
 */
export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={style.footer}>
      <div className={style.footer__container}>
        <div className={style.footer__content}>
          <div className={style.footer__brand}>
            <span className={style.footer__brandName}>Stack-Flex</span>
            <p className={style.footer__baseline}>Design accessible & performant</p>
          </div>

          <p className={style.footer__copyright}>© {currentYear} AlgoNetDesign</p>
        </div>
      </div>
    </footer>
  );
}
