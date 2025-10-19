import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { DetailSection, MenuSectionsVisibility, Point, ViewBoxRect } from '@/types';
import { ModalFormButton } from '@components/ModalFormButton';
import { useOnScreen } from '@hooks/useOnScreen';
import titleLine from '@images/decorations/title_line.svg';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { INTERSECTION_OPTIONS_ROOTMARGIN } from '@utils/constants';

import style from './style.module.css';
import type { HeroElementsRect, ShowcaseSectionProps } from './types';
import {
  CORNER_RADII_DEFAULT,
  CTA_CLEAR,
  LEFT_GUTTER_MIN,
  MIN_AFTER_H1,
  MIN_OBLIQUE_DX,
  OFFSET_TOP_KICKER,
  OFFSET_UNDER_H1,
  RAIL_MARGIN_FROM_TEXT,
  TAN_60,
} from './utils/constants';
import { DynamicElement } from '../DynamicElement';
import type { ValidComponentTag, ValidHTMLTag } from '../DynamicElement/types';
import { DynamicElementContainer } from '../DynamicElementContainer';
import { HeroConnector } from '../HeroConnector';

function hasBox(el: Element | null | undefined) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function computeHeroGeometry({ sectionRect, kickerRect, titleRect, buttonRect }: HeroElementsRect): {
  connectorPoints: Point[];
  viewBox: ViewBoxRect;
} {
  // 1) mesures de base
  const w = Math.max(1, sectionRect.width);
  const h0 = Math.max(1, sectionRect.height);
  const ox = sectionRect.left;
  const oy = sectionRect.top;

  // A : départ au niveau du kicker (haut)
  const xRail = Math.max(LEFT_GUTTER_MIN, titleRect.left - ox - RAIL_MARGIN_FROM_TEXT);
  const A: Point = { x: Math.round(xRail), y: Math.round(kickerRect.top - oy + OFFSET_TOP_KICKER) };

  // B : fin du vertical, sous le H1
  const yRail = titleRect.bottom - oy + OFFSET_UNDER_H1;
  const B: Point = { x: Math.round(xRail), y: Math.round(yRail) };

  // CTA : centre X et ligne au-dessus
  const xMidCTA = buttonRect.left - ox + buttonRect.width / 2;
  const yE = buttonRect.top - oy - CTA_CLEAR; // 5) ligne où on s’arrête au-dessus du CTA

  // 4) D : point d’arrivée de l’oblique, aligné sur le centre X du CTA
  //    D.y sera déterminé par la 60° → il ne doit pas dépasser yE
  // 2)–3) C : fin de l’horizontale (début oblique), à choisir pour garantir la 60° et l’arrêt avant yE
  //    tan(60) = (D.y - yRail) / (D.x - C.x)
  //    Si on veut D.y <= yE, alors C.x >= D.x - (yE - yRail)/tan(60)
  const minCxFromE = xMidCTA - Math.max(1, yE - yRail) / TAN_60;
  const minAfterH1 = titleRect.right - ox + MIN_AFTER_H1;

  // C.x ne peut pas dépasser D.x - MIN_OBLIQUE_DX (sinon oblique trop courte)
  let Cx = Math.max(minAfterH1, minCxFromE, LEFT_GUTTER_MIN);
  const maxCx = xMidCTA - MIN_OBLIQUE_DX;
  if (Cx > maxCx) Cx = maxCx;

  const C: Point = { x: Math.round(Cx), y: Math.round(yRail) };

  // 3) & 4) D : oblique à 60°, jusqu’à l’alignement vertical du centre du CTA
  const Dy = yRail + TAN_60 * (xMidCTA - Cx);
  // if (Dy > yE) Dy = yE;
  const D: Point = { x: Math.round(xMidCTA), y: Math.min(Dy, yE) }; // sécurité : ne pas descendre sous yE

  // 4)–5) E : verticale qui rejoint la ligne au-dessus du CTA (même X que D)
  const E: Point = { x: Math.round(xMidCTA), y: Math.round(yE) };

  const connectorPoints: Point[] = [A, B, C, D, E];

  // 5) viewBox : largeur = w ; hauteur = max(hauteur actuelle, point le plus bas + marge)
  const deepestY = Math.max(...connectorPoints.map((p) => p.y));
  const strokePad = 16; // petite marge pour ne pas clipper le trait arrondi
  const hNeeded = Math.ceil(Math.max(h0, deepestY + strokePad));

  return { connectorPoints, viewBox: { minX: 0, minY: 0, width: w, height: hNeeded } };
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
 * @property {function} [openModalFormDialog] - Trigger for opening the contact modal to use button in the section.
 * @property {boolean} showModalFormDialog - The current state of the contact form dialog.
 * @property {string} modalId - The id of the modal.
 * @returns {React.JSX.Element} The rendered Tag component.
 *
 * @al-dev93
 */
export const ShowcaseSection = memo(function MemoizedShowcaseSection({
  content,
  anchor,
  title,
  MenuSectionsVisibility,
  openModalFormDialog,
  showModalFormDialog,
  modalId,
}: ShowcaseSectionProps): React.JSX.Element | null {
  const handleError = useErrorHandler();

  const isHero = !title;

  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [drawPath, setDrawPath] = useState<boolean>(false);
  const [animTick, setAnimTick] = useState<number>(0);
  const [vb, setVb] = useState<ViewBoxRect>({ minX: 0, minY: 0, width: 1000, height: 420 });
  const [points, setPoints] = useState<Point[]>([]);

  const { isIntersecting, observerError } = useOnScreen(isHero ? titleRef : sectionRef, {
    threshold: isHero ? [0.45] : undefined,
    ...INTERSECTION_OPTIONS_ROOTMARGIN,
  });

  const [mainContent, brandContent] = useMemo<[DetailSection[], DetailSection[] | undefined]>(() => {
    const sortContent = content.sort((a, b) => a.orderInSection - b.orderInSection);

    return isHero
      ? sortContent.reduce(
          (prev: [DetailSection[], DetailSection[]], curr) =>
            curr.name === 'brand' ? [prev[0], [...prev[1], curr]] : [[...prev[0], curr], prev[1]],
          [[], []],
        )
      : [sortContent, undefined];
  }, [content, isHero]);

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

  useLayoutEffect(() => {
    if (!isHero || !sectionRef.current) return undefined;

    const section = sectionRef.current;
    const kicker = kickerRef.current;
    const heroTitle = titleRef.current;
    const button = buttonRef.current;

    if (!kicker || !heroTitle || !button) return undefined;

    const updateHeroConnectorGeometry = (): void => {
      if (!hasBox(section) || !hasBox(kicker) || !hasBox(heroTitle) || !hasBox(button)) return;
      const { connectorPoints, viewBox } = computeHeroGeometry({
        sectionRect: section.getBoundingClientRect(),
        kickerRect: kicker.getBoundingClientRect(),
        titleRect: heroTitle.getBoundingClientRect(),
        buttonRect: button.getBoundingClientRect(),
      });
      setPoints(connectorPoints);
      setVb(viewBox);
    };

    let raf = 0;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateHeroConnectorGeometry();
      });
    };

    const ro = new ResizeObserver(schedule);

    ro.observe(section);

    let cancelled = false;
    const r1 = requestAnimationFrame(() => {
      if (!cancelled) updateHeroConnectorGeometry();
    });
    const onLoad = () => {
      if (!cancelled) updateHeroConnectorGeometry();
    };
    window.addEventListener('load', onLoad, { once: true });

    if ('fonts' in document && document.fonts?.ready?.then) {
      document.fonts.ready.then(() => {
        if (!cancelled) updateHeroConnectorGeometry();
      });
    }

    updateHeroConnectorGeometry();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      cancelAnimationFrame(r1);
      window.removeEventListener('load', onLoad);
      ro.disconnect();
    };
  }, [isHero]);

  useEffect(() => {
    if (!isHero || !isIntersecting) {
      setDrawPath(false);
      return undefined;
    }

    setDrawPath(false);

    const id = requestAnimationFrame(() => setDrawPath(true));

    return () => cancelAnimationFrame(id);
  }, [isHero, isIntersecting, animTick]);

  const handlePathComputed = useCallback(() => setAnimTick((t) => t + 1), []);

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
    (node: DetailSection): string => {
      if (!node.name) return '';
      const { name } = node;

      return style[`section${isHero ? '--hero' : ''}__${name}`];
    },
    [isHero],
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
      <div className={style.section__titleSection}>
        <h2 id={`${anchor}-title`} aria-live='polite'>
          {title}
        </h2>
        <img src={titleLine} alt='Decorative line' />
      </div>
    );
  }, [anchor, title]);

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
      if (!isRenderNode(renderNode)) return null;
      const getNodeRef = () => {
        if (!renderNode.name || !['kicker', 'title'].includes(renderNode.name)) return undefined;
        if (renderNode.name === 'kicker') return kickerRef;
        return titleRef;
      };

      return (
        <DynamicElement
          key={renderNode.id}
          id={renderNode.tag === 'h1' ? `${anchor}-title` : undefined}
          tag={renderNode.tag as ValidHTMLTag | ValidComponentTag}
          endpoint={renderNode.endpoint}
          className={getElementClassName(renderNode)}
          aria-hidden={renderNode.name === 'brand' ? 'true' : undefined}
          ref={isHero ? getNodeRef() : undefined}
        >
          {renderNode.content}
          {renderNode.boldContent?.length
            ? renderNode.boldContent.map((item) => {
                return isRenderNode(item) ? (
                  <DynamicElement
                    key={item.id}
                    tag={item.tag as ValidHTMLTag | ValidComponentTag}
                    className={getElementClassName(item)}
                  >
                    {item.content}
                  </DynamicElement>
                ) : null;
              })
            : null}
        </DynamicElement>
      );
    },
    [anchor, getElementClassName, isHero],
  );

  return (
    <section
      className={style.section + (isHero ? ` ${style['section--hero']}` : '')}
      ref={sectionRef}
      id={anchor}
      tabIndex={-1}
      aria-labelledby={`${anchor}-title`}
    >
      {isHero && points.length >= 5 ? (
        <HeroConnector
          from={{ x: points[0].x, y: points[0].y }}
          via={[
            { x: points[1].x, y: points[1].y },
            { x: points[2].x, y: points[2].y },
            { x: points[3].x, y: points[3].y },
          ]}
          to={{ x: points[4].x, y: points[4].y }}
          width={vb.width}
          height={vb.height}
          radiiXY={[
            [12, 12],
            [18, 10],
            [8, 18],
          ]}
          cornerRadius={CORNER_RADII_DEFAULT}
          glow
          animated
          brightSpotMode='replay'
          bloomEnabled
          isRevealed={drawPath}
          className={style['section--hero__path']}
          onPathComputed={handlePathComputed}
        />
      ) : null}
      <div className={style.section__bodySection}>
        {showcaseSectionTitle}
        {mainContent.map((renderNode) =>
          !renderNode.wrapped ? (
            renderDynamicElement(renderNode)
          ) : (
            <DynamicElementContainer
              key={renderNode.id}
              tag={renderNode.tag as ValidHTMLTag | ValidComponentTag}
              className={getElementClassName(renderNode)}
              filterValue='card'
              endpoint={renderNode.endpoint}
              method='POST'
            />
          ),
        )}
      </div>
      <ModalFormButton
        className={style.section__button}
        name='Contact'
        onClick={openModalFormDialog}
        ariaLabel='Open contact form'
        ariaExpanded={showModalFormDialog}
        ariaHasPopup='dialog'
        ariaControls={modalId}
        ref={isHero ? buttonRef : undefined}
      />
      {brandContent ? brandContent.map((renderNode) => renderDynamicElement(renderNode)) : null}
    </section>
  );
});
