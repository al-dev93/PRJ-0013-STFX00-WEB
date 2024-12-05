import React, { useEffect, useId, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { SocialMediaNavBar } from '@components/SocialMediaNavBar';
import logo from '@images/brand/logoAND.png';
import { CollapsibleHeader } from '@modules/CollapsibleHeader';
import { ModalDialogContactForm } from '@modules/ModalDialogContactForm';

import style from './style.module.css';

import type { OutletContextPage, PageProps, MenuSectionsVisibility } from '@/types';

/**
 * The main page component of the application.
 *
 * @component
 * @param {PageProps} props - The properties for the Page component
 * @property {CryptoKey} cryptoKey - Encryption data to hide email address
 * @returns {React.JSX.Element}
 *
 * @al-dev93
 */
export function Page({ cryptoKey }: PageProps): React.JSX.Element {
  // stores the current location of the page using react-router hooks.
  const { pathname, hash, key } = useLocation();
  // stores the current scroll position triggered by the menu interaction.
  const scrollWithNav = useRef<number>();
  // stores the current visible sections of the page and the active menu item(s).
  const viewSectionContext = useRef<MenuSectionsVisibility>({ home: true });
  // stores the reference to the skip link element to focus when the component mounts.
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  // stores the state of the contact form dialog and the id of the modal.
  const [openContactFormDialog, setOpenContactFormDialog] = useState<boolean>(false);
  const modalId = useId();

  /**
   * Scroll to the top of the page when the hash, or the pathname, or the key changes.
   */
  useEffect((): void => {
    if (hash === '') window.scrollTo(0, 0);
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
          scrollWithNav.current = window.scrollY;
        }
      }, 0);
    }
  }, [hash, pathname, key]);

  /**
   * Scroll to the top of the page when the openContactFormDialog state changes
   */
  useEffect(() => {
    if (openContactFormDialog) {
      document.body.classList.add('scrollOff');
      return;
    }
    document.body.classList.remove('scrollOff');
  }, [openContactFormDialog]);

  /**
   * Focus the skip link when the component mounts.
   */
  useEffect(() => {
    if (skipLinkRef.current) skipLinkRef.current.focus();
  }, []);

  return (
    <div className={style.mainPage} aria-hidden={openContactFormDialog}>
      {/* Skip link for accessibility purposes */}
      <a href='#home' className='visually-hidden visually-hidden-focusable' ref={skipLinkRef}>
        Aller à l&apos;introduction
      </a>
      {/* Header component */}
      <CollapsibleHeader
        logo={{ src: logo, alt: 'logo' }}
        MenuSectionsVisibility={viewSectionContext}
        scrollWithMenuItem={scrollWithNav}
      />
      {/* Contact form dialog */}
      <ModalDialogContactForm
        open={openContactFormDialog}
        setOpen={setOpenContactFormDialog}
        modalId={modalId}
        url={['http://localhost:5173/api/contactFormModals', 'http://localhost:5173/api/contactFormInputs']}
      />
      {/* Social media navigation bar component for left navigation */}
      <SocialMediaNavBar
        className={style.socialMediaNavBar}
        type='left-nav'
        url='http://localhost:5173/api/accounts'
        cryptoKey={cryptoKey}
      />

      <main className={style.main} aria-label='Introduction et contenu principal'>
        <Outlet
          context={
            {
              viewSectionContext,
              setOpenContactFormDialog,
              openContactFormDialog,
              modalId,
            } satisfies OutletContextPage
          }
        />
      </main>
      <footer>Pied-de-page</footer>
    </div>
  );
}
