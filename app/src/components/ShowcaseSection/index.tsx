import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { DetailSection, MenuSectionsVisibility } from '@/types';
import { ModalFormButton } from '@components/ModalFormButton';
import { useOnScreen } from '@hooks/useOnScreen';
import titleLine from '@images/decorations/title_line.svg';
import { useErrorHandler } from '@modules/Error/hooks/useErrorHandler';
import { createError } from '@modules/Error/utils/errorHandling';
import { INTERSECTION_OPTIONS_ROOTMARGIN } from '@utils/constants';

import style from './style.module.css';
import type { Point, RoundPerCornerOpts, ShowcaseSectionProps, ViewBoxRect } from './types';
import { DynamicElement } from '../DynamicElement';
import type { ValidComponentTag, ValidHTMLTag } from '../DynamicElement/types';
import { DynamicElementContainer } from '../DynamicElementContainer';

function computeSweep(vIn: Point, vOut: Point, flip: boolean): 0 | 1 {
  const z = vIn[0] * vOut[1] - vIn[1] * vOut[0]; // produit vectoriel (repère SVG : y vers le bas)
  let s: 0 | 1 = 0;
  if (z < 0) {
    s = 1;
  }
  if (flip) {
    s = s === 1 ? 0 : 1;
  }
  return s;
}

function hasBox(el: Element | null | undefined) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function roundedPathArc(pts: Point[], opts: RoundPerCornerOpts = {}): string {
  const n = pts.length;
  if (n < 2) return '';

  const defaultRadius = opts.defaultRadius ?? 20;
  const { defaultRadiusX } = opts;
  const { defaultRadiusY } = opts;

  const radii = opts.radii ?? [];
  const radiiXY = opts.radiiXY ?? [];
  const excludeSet = new Set<number>(opts.excludeAt ?? []);
  const forced = opts.forceSweep ?? [];
  const flipAll = opts.flipAll ?? false;

  const path: string[] = [`M ${pts[0][0]} ${pts[0][1]}`];
  // path.push(`M ${pts[0][0]} ${pts[0][1]}`);

  // coins internes : 1 .. (n-2)
  for (let i = 1; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const cornerIndex = i - 1; // index du coin

    // --- rayon du coin (priorité radiiXY > defaultRadiusX/Y > radii > defaultRadius)
    let rx: number | undefined;
    let ry: number | undefined;

    const hasXY = cornerIndex >= 0 && cornerIndex < radiiXY.length && Array.isArray(radiiXY[cornerIndex]);
    if (hasXY) {
      [rx, ry] = radiiXY[cornerIndex];
    } else if (defaultRadiusX !== undefined && defaultRadiusY !== undefined) {
      rx = defaultRadiusX;
      ry = defaultRadiusY;
    } else if (cornerIndex >= 0 && cornerIndex < radii.length && typeof radii[cornerIndex] === 'number') {
      rx = radii[cornerIndex];
      ry = radii[cornerIndex];
    } else {
      rx = defaultRadius;
      ry = defaultRadius;
    }

    // vecteurs
    const vIn: Point = [p0[0] - p1[0], p0[1] - p1[1]];
    const vOut: Point = [p2[0] - p1[0], p2[1] - p1[1]];
    const lenIn = Math.hypot(vIn[0], vIn[1]);
    const lenOut = Math.hypot(vOut[0], vOut[1]);

    // conditions “angle vif” (pas d’arrondi)
    const exclude = excludeSet.has(i);
    const badRadius = (rx ?? 0) <= 0 || (ry ?? 0) <= 0;
    const degenerate = lenIn === 0 || lenOut === 0;

    if (exclude || badRadius || degenerate) {
      // angle vif
      path.push(`L ${p1[0]} ${p1[1]}`);
    } else {
      // arrondi (arc)
      const nIn: Point = [vIn[0] / lenIn, vIn[1] / lenIn];
      const nOut: Point = [vOut[0] / lenOut, vOut[1] / lenOut];

      let dEff = Math.min(rx!, ry!);
      const halfIn = lenIn / 2;
      const halfOut = lenOut / 2;
      if (dEff > halfIn) dEff = halfIn;
      if (dEff > halfOut) dEff = halfOut;

      const entry: Point = [p1[0] + nIn[0] * dEff, p1[1] + nIn[1] * dEff];
      const exit: Point = [p1[0] + nOut[0] * dEff, p1[1] + nOut[1] * dEff];

      // sweep : forcé > auto > (éventuel flipAll)
      let sweep: 0 | 1;
      const forcedVal = forced[cornerIndex];
      if (forcedVal === 0 || forcedVal === 1) {
        sweep = forcedVal;
      } else {
        sweep = computeSweep(vIn, vOut, flipAll);
      }

      path.push(`L ${entry[0]} ${entry[1]}`);
      path.push(`A ${rx} ${ry} 0 0 ${sweep} ${exit[0]} ${exit[1]}`);
    }
  }

  // terminer sur le dernier point
  const last = pts[n - 1];
  path.push(`L ${last[0]} ${last[1]}`);

  return path.join(' ');
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
  const isHero = !title;
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isMeasured = useRef<boolean>(false);

  const CORNER_RADII_DEFAULT = 18; // rayon d’arrondi par défaut

  const [drawPath, setDrawPath] = useState<boolean>(false);
  const [vb, setVb] = useState<ViewBoxRect>([0, 0, 1000, 420]);
  const [points, setPoints] = useState<Point[]>([]);
  const [heroReady, setHeroReady] = useState<boolean>(false);

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

  useEffect(() => {
    if (!isHero) return undefined;

    let raf = 0;
    const check = () => {
      const ready =
        hasBox(sectionRef.current) &&
        hasBox(kickerRef.current) &&
        hasBox(titleRef.current) &&
        // hasBox(pitchRef.current)   &&
        hasBox(buttonRef.current); // + brandRef si tu l’utilises

      if (ready) {
        setHeroReady(true);
      } else {
        // recheck next frame jusqu’à ce que tout soit là
        raf = requestAnimationFrame(check);
      }
    };

    check();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHero]);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const d = path.getAttribute('d');
    if (!d) return;

    const length = Math.ceil(path.getTotalLength());
    path.style.setProperty('--hero-dash', `${length}`);
    isMeasured.current = true;

    if (isHero && isIntersecting) {
      setDrawPath(false); // retire la classe pour reset
      requestAnimationFrame(() => setDrawPath(true));
    }
  }, [isHero, isIntersecting, points, vb]);

  useEffect(() => {
    if (!isHero || !isMeasured.current) return;

    setDrawPath(isIntersecting);
  }, [isHero, isIntersecting]);

  useLayoutEffect(() => {
    if (!isHero || !sectionRef.current || !isIntersecting || !heroReady) return undefined;

    const sec = sectionRef.current;

    const compute = () => {
      // 1) mesures de base
      const rect = sec.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h0 = Math.max(1, rect.height);
      const ox = rect.left;
      const oy = rect.top;

      const kicker = kickerRef.current;
      const heroTitle = titleRef.current;
      const ctaBtn = buttonRef.current;

      if (!heroTitle || !ctaBtn || !kicker) return;

      // 2) constantes (tweakables)
      const OFFSET_TOP_KICKER = 10.3;
      const RAIL_MARGIN_FROM_TEXT = 8; // espace entre rail et colonne texte
      const LEFT_GUTTER_MIN = 0; // gouttière gauche minimale
      const OFFSET_UNDER_H1 = 14; // vertical-align du rail sous le H1
      const CTA_CLEAR = 10; // distance au-dessus du CTA (ne pas toucher)
      const MIN_AFTER_H1 = 28; // “air” après le bord droit du H1 si besoin
      const TAN_60 = Math.tan(Math.PI / 3); // ≈ 1.732 (oblique 60°)
      const MIN_OBLIQUE_DX = 60; // longueur min de l’oblique en x

      // 3) boîtes
      const heroTitleRect = heroTitle.getBoundingClientRect();
      const kickerRect = kicker.getBoundingClientRect();
      const ctaBtnRect = ctaBtn.getBoundingClientRect();

      // A : départ au niveau du kicker (haut)
      const xRail = Math.max(LEFT_GUTTER_MIN, heroTitleRect.left - ox - RAIL_MARGIN_FROM_TEXT);
      const A: Point = [xRail, kickerRect.top - oy + OFFSET_TOP_KICKER];

      // B : fin du vertical, sous le H1
      const yRail = heroTitleRect.bottom - oy + OFFSET_UNDER_H1;
      const B: Point = [xRail, yRail];

      // CTA : centre X et ligne au-dessus
      const xMidCTA = ctaBtnRect.left - ox + ctaBtnRect.width / 2;
      const yE = ctaBtnRect.top - oy - CTA_CLEAR; // 5) ligne où on s’arrête au-dessus du CTA

      // 4) D : point d’arrivée de l’oblique, aligné sur le centre X du CTA
      //    D.y sera déterminé par la 60° → il ne doit pas dépasser yE
      // 2)–3) C : fin de l’horizontale (début oblique), à choisir pour garantir la 60° et l’arrêt avant yE
      //    tan(60) = (D.y - yRail) / (D.x - C.x)
      //    Si on veut D.y <= yE, alors C.x >= D.x - (yE - yRail)/tan(60)
      const minCxFromE = xMidCTA - Math.max(1, yE - yRail) / TAN_60;
      const minAfterH1 = heroTitleRect.right - ox + MIN_AFTER_H1;

      // C.x ne peut pas dépasser D.x - MIN_OBLIQUE_DX (sinon oblique trop courte)
      let Cx = Math.max(minAfterH1, minCxFromE, LEFT_GUTTER_MIN);
      const maxCx = xMidCTA - MIN_OBLIQUE_DX;
      if (Cx > maxCx) Cx = maxCx;

      const C: Point = [Cx, yRail];

      // 3) & 4) D : oblique à 60°, jusqu’à l’alignement vertical du centre du CTA
      const Dy = yRail + TAN_60 * (xMidCTA - Cx);
      const D: Point = [xMidCTA, Math.min(Dy, yE)]; // sécurité : ne pas descendre sous yE

      // 4)–5) E : verticale qui rejoint la ligne au-dessus du CTA (même X que D)
      const E: Point = [xMidCTA, yE];

      const pts: Point[] = [A, B, C, D, E];
      setPoints(pts);

      // 5) viewBox : largeur = w ; hauteur = max(hauteur actuelle, point le plus bas + marge)
      const deepestY = Math.max(...pts.map((p) => p[1]));
      const strokePad = 16; // petite marge pour ne pas clipper le trait arrondi
      const hNeeded = Math.ceil(Math.max(h0, deepestY + strokePad));

      setVb([0, 0, w, hNeeded]);

      // (optionnel) si tu veux que la section elle-même s’étire quand le path descend plus bas :
      // sec.style.minHeight = `${neededH}px`;
    };

    const ro = new ResizeObserver(() => compute());
    ro.observe(sec);
    compute();
    return () => ro.disconnect();
  }, [heroReady, isHero, isIntersecting]);

  const pathEl = useMemo<JSX.Element | null>(() => {
    if (!isHero || points.length < 2) return null;
    const d = roundedPathArc(points, {
      defaultRadius: CORNER_RADII_DEFAULT,
      // coins internes pour A→B→C→D→E : [B, C, D]
      // radii: [12, 0, 0],
      // forceSweep: [1, 1, 1], // si un coin bombe du mauvais côté, fixe 0/1 ici
      radiiXY: [
        [12, 12], // coin B (sous H1)
        [18, 10], // coin C (départ oblique)
        [8, 18], // coin D (jonction oblique→verticale)
      ],
    });

    const [cx, cy] = points[points.length - 1];
    const endcapR = 3.5;

    return (
      <svg
        className={style['section--hero__path']}
        viewBox={`${vb[0]} ${vb[1]} ${vb[2]} ${vb[3]}`}
        aria-hidden='true'
        focusable='false'
        preserveAspectRatio='none'
        pointerEvents='none'
      >
        <path
          d={d}
          className={`${style['section--hero__stroke']} ${drawPath ? style['is-visible'] : ''}`}
          fill='none'
          stroke='currentColor'
          strokeWidth={3} // 2–3 selon ton rendu
          strokeLinecap='round'
          strokeLinejoin='round'
          vectorEffect='non-scaling-stroke'
          ref={pathRef}
        />
        <path
          d={d}
          className={style['section--hero__strokeHalo']}
          fill='none'
          stroke='currentColor'
          strokeWidth={3} // 2–3 selon ton rendu
          strokeLinecap='round'
          strokeLinejoin='round'
          vectorEffect='non-scaling-stroke'
        />
        <circle className={style['section--hero__endcap']} cx={cx} cy={cy} r={endcapR} />
      </svg>
    );
  }, [drawPath, isHero, points, vb]);

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
    return title ? (
      <div className={style.section__titleSection}>
        <h2 id={`${anchor}-title`} aria-live='polite'>
          {title}
        </h2>
        <img src={titleLine} alt='Decorative line' />
      </div>
    ) : null;
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
      {isHero ? pathEl : null}
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
}

export const ShowcaseSection = memo(MemoizedShowcaseSection);
