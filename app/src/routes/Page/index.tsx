import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import type { OutletContextPage, SectionsRef } from '@/types';
import { SocialMediaNavBar } from '@components/SocialMediaNavBar';
import logo from '@images/brand/logoAND.png';
import { CollapsibleHeader } from '@modules/CollapsibleHeader';
import { useCsrfToken } from '@modules/ModalDialogContactForm/hooks/useCsrfToken';
import ModalDialogContactForm from '@modules/ModalDialogContactForm/ModalDialogContactFormWithProvider';

import style from './style.module.css';

/**
 * Page
 *
 * Main landing route of the app. Handles:
 * - Anchor navigation to in-page sections (#home/#about/#work).
 * - Deterministic scroll + focus after SPA navigations (including cross-route).
 * - Background scroll locking while the contact dialog is open.
 * - Focus restoration to the opener after dialog close (without scroll jumps).
 *
 * Accessibility:
 * - Uses programmatic focus (with `preventScroll`) so screen readers announce the target.
 * - Works with sticky headers via `scroll-margin-top`/`scroll-padding-top` on targets/containers.
 *
 * Side effects:
 * - Mutates `document.body` styles for scroll lock.
 * - Listens to document-level clicks (capture) for "same-hash" re-trigger.
 *
 * @component
 * @returns {React.JSX.Element}
 * @since 2025-08
 * @author al-dev93
 */
export function Page(): React.JSX.Element {
  const csrfToken = useCsrfToken();
  // Current routing state (used to derive anchor targets and issue router updates).
  const { pathname, hash, key, search } = useLocation();
  const navigate = useNavigate();

  // Forwarded to header; used to coordinate menu-driven scroll logic if needed downstream.
  const scrollWithNav = useRef<number>();

  // Shared active context for menu highlighting.
  const [activeSection, setActiveSection] = useState<SectionsRef>('home');

  // Root to observe for section availability after route changes (Outlet renders inside).
  const mainRef = useRef<HTMLElement | null>(null);

  // Scrollspy
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return undefined;

    const sectionIds = ['home', 'about', 'work'] as const satisfies readonly SectionsRef[];

    let animationFrameId: number | null = null;

    const updateActiveSection = () => {
      animationFrameId = null;

      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);

      if (sections.length === 0) return;

      /*
       * A single virtual line determines the active section.
       * The most recent section whose top has crossed the middle
       * of the viewport becomes active.
       */
      const activationLine = window.innerHeight / 2;

      let nextActiveSection: (typeof sectionIds)[number] = sectionIds[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top > activationLine) break;

        nextActiveSection = section.id as (typeof sectionIds)[number];
      }

      setActiveSection((currentSection) => (currentSection === nextActiveSection ? currentSection : nextActiveSection));
    };

    const scheduleUpdate = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(mainElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      observer.disconnect();

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Element that opened the dialog (focus will be restored on close).
  const lastOpenerRef = useRef<HTMLElement | null>(null);

  // One-shot guard: prevents the route/hash effect from stealing focus right after dialog close.
  const suppressNextRouteFocusRef = useRef(false);

  // Remembered scroll position while the dialog is open (body is fixed).
  const yRef = useRef(0);

  // Contact dialog UI state and unique id.
  const [openContactFormDialog, setOpenContactFormDialog] = useState<boolean>(false);
  const modalId = `modal-${useId()}`;

  // Fallback section id when no hash is present.
  const DEFAULT_ID = 'home';

  /**
   * Waits for an element with the given id to exist in the DOM, then runs `fn` once.
   * Uses a one-shot MutationObserver and auto-cleans on success or timeout.
   *
   * @param {string} id - Target element id to watch for.
   * @param {() => void} fn - Callback executed once the element is available.
   * @param {Node} [root=mainRef.current ?? document] - Observation root (defaults to <main> subtree).
   * @param {number} [timeoutMs=2000] - Safety timeout to disconnect the observer.
   * @returns {() => void} Cleanup function (disconnects observer and clears timeout).
   */
  function onElementAvailable(
    id: string,
    fn: () => void,
    root: Node = mainRef.current ?? document,
    timeoutMs = 2000,
  ): () => void {
    // Fast-path: already in DOM.
    if (document.getElementById(id)) {
      fn();
      return () => {};
    }
    const observer = new MutationObserver(() => {
      if (document.getElementById(id)) {
        observer.disconnect();
        fn();
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    const t = window.setTimeout(() => observer.disconnect(), timeoutMs);
    return () => {
      observer.disconnect();
      window.clearTimeout(t);
    };
  }

  /**
   * Extracts a clean element id from a URL hash string (with or without leading '#').
   *
   * @param {string | null} currentHash
   * @returns {string | null} Decoded id or null.
   */
  function idFromHash(currentHash: string | null): string | null {
    if (!currentHash) return null;
    const raw = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash;
    return raw ? decodeURIComponent(raw) : null;
  }

  /**
   * Scrolls to a target element by id and gives it focus (without causing a second scroll).
   * Ensures non-natively-focusable targets can receive programmatic focus via `tabIndex=-1`.
   *
   * @param {string} id - Element id to bring into view.
   * @returns {boolean} True if the element exists and scrolling was initiated.
   */
  const scrollAndFocusById = useCallback((id: string): boolean => {
    const targetElement = document.getElementById(id) as HTMLElement | null;
    if (!targetElement) return false;

    targetElement.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });

    // Make programmatically focusable only when necessary.
    if (
      !targetElement.matches('a[href], button, input, select, textarea, [contenteditable="true"]') &&
      !targetElement.hasAttribute('tabindex')
    ) {
      targetElement.tabIndex = -1;
    }

    // Do not override intentional focus inside the target.
    if (document.activeElement !== targetElement && !targetElement.contains(document.activeElement)) {
      (targetElement as HTMLElement).focus({ preventScroll: true });
    }
    return true;
  }, []);

  /**
   * Skip-link handler: jump to the main region ("home") and keep the URL hash in sync.
   *
   * Note:
   * - Uses Router `navigate(..., { replace: true })` to avoid adding an extra history entry.
   * - If the same hash is already present, it attempts immediate scroll/focus; otherwise, it will
   *   wait for the target to appear in the DOM (one-shot observer).
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e
   * @returns {void}
   */
  const handleSkipToContent = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const id = DEFAULT_ID;

      if (hash !== `#${id}`) {
        navigate({ pathname, search, hash: `#${id}` }, { replace: true });
      } else if (!scrollAndFocusById(id)) {
        onElementAvailable(id, () => {
          scrollAndFocusById(id);
        });
      }
    },
    [hash, navigate, pathname, scrollAndFocusById, search],
  );

  /**
   * Dialog open/close effect (runs before paint).
   *
   * - ON OPEN:
   *   - Store opener element and current scrollY.
   *   - Lock background scroll via `.scrollOff` and freeze layout at the same visual position
   *     using `body.style.top = -scrollY` (prevents any jump).
   *
   * - ON CLOSE:
   *   - Unlock scroll and restore the exact scroll position.
   *   - Temporarily force `scroll-behavior: auto` to avoid smooth-scroll artifacts.
   *   - Set the suppression flag so the route/hash effect does not run immediately.
   *   - Restore focus to the opener with `{ preventScroll: true }`.
   */
  useLayoutEffect(() => {
    if (openContactFormDialog) {
      lastOpenerRef.current = document.activeElement as HTMLElement | null;
      yRef.current = window.scrollY || 0;
      document.body.style.top = `-${yRef.current}px`;
      document.body.classList.add('scrollOff');
      return;
    }
    document.body.classList.remove('scrollOff');

    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    document.body.style.top = '';
    window.scrollTo(0, yRef.current);

    suppressNextRouteFocusRef.current = true;
    lastOpenerRef.current?.focus?.({ preventScroll: true });

    html.style.scrollBehavior = prevBehavior || '';
  }, [openContactFormDialog]);

  /**
   * Anchor navigation effect (runs before paint).
   *
   * Purpose:
   * - After route/hash changes, scroll to and focus the target section.
   * - Skip while the dialog is open.
   * - Skip exactly once right after dialog close (consumes suppression flag).
   * - If the target is not yet in the DOM (Outlet still mounting), arm a one-shot observer
   *   on `<main>` and execute when available.
   *
   * Dependencies:
   * - React Router signals: [pathname, hash, key]
   * - `openContactFormDialog` and `scrollAndFocusById`.
   */
  useLayoutEffect(() => {
    if (openContactFormDialog) return () => {};

    // Consume the one-shot suppression right after dialog close.
    if (suppressNextRouteFocusRef.current) {
      suppressNextRouteFocusRef.current = false;
      return () => {};
    }

    const targetId = idFromHash(hash) || DEFAULT_ID;

    // Try immediately; if not available yet, wait for it under <main>.
    const ok = scrollAndFocusById(targetId);
    if (!ok) {
      return onElementAvailable(
        targetId,
        () => {
          scrollAndFocusById(targetId);
        },
        mainRef.current ?? document,
      );
    }
    return () => {};
  }, [pathname, hash, key, scrollAndFocusById, openContactFormDialog]);

  /**
   * Same-hash re-trigger (document-level, capture phase).
   *
   * Rationale:
   * - If the user clicks a menu item that points to the same hash already in the URL,
   *   React Router won't navigate. We explicitly re-run scroll+focus for that case.
   *
   * Filters:
   * - Unmodified primary-button clicks only.
   * - Same origin and protocol, same pathname (otherwise the route effect will handle it).
   *
   * Cleanup:
   * - Removes the listener on unmount to avoid duplicates.
   */
  useEffect(() => {
    const onSameHashClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      if (!href.includes('#')) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname !== window.location.pathname) return;
      if (url.hash && url.hash === window.location.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!id) return;
        if (!scrollAndFocusById(id)) {
          onElementAvailable(id, () => {
            scrollAndFocusById(id);
          });
        }
      }
    };

    document.addEventListener('click', onSameHashClick, true);
    return () => document.removeEventListener('click', onSameHashClick, true);
  }, [scrollAndFocusById]);

  return (
    // If the dialog is rendered via a portal (recommended), `aria-hidden`
    // will correctly hide background content from AT while leaving the dialog exposed.
    // If not portaled, avoid applying `aria-hidden` on this wrapper.
    <div className={style.mainPage} aria-hidden={openContactFormDialog}>
      {/* Skip link for keyboard users; announced as a quick jump to the main content */}
      <a href='#home' className={style['skip-link']} onClick={handleSkipToContent}>
        Aller au contenu
      </a>
      {/* Collapsible site header (logo + navigation) */}
      <CollapsibleHeader
        logo={{ src: logo, alt: 'logo' }}
        activeSection={activeSection}
        scrollWithMenuItem={scrollWithNav}
      />
      {/* Contact form dialog */}
      <ModalDialogContactForm
        open={openContactFormDialog}
        setOpen={setOpenContactFormDialog}
        modalId={modalId}
        csrfToken={csrfToken}
      />
      {/* Left-side social links (external navigation) */}
      <SocialMediaNavBar className={style.socialMediaNavBar} type='left-nav' />
      {/* Main content; observed to detect when anchor targets become available */}
      <main className={style.main} aria-label='Introduction et contenu principal' ref={mainRef}>
        <Outlet
          context={
            {
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
