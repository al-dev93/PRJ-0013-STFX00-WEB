import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { SpotMotionAPI, SpotMotionMode, SpotMotionOptions } from './types';

// Isomorphic layout effect: layout on client, passive effect on server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Forces a layout read to commit style changes (used to re-arm transitions).
const reflow = (element: Element) => element.getBoundingClientRect();

/**
 * Controls the connector’s motion lifecycle (stroke reveal, bright-spot travel, completion)
 * and bridges runtime state to CSS via data-attributes and CSS variables.
 *
 * @param options - See {@link SpotMotionOptions} for all available settings.
 *
 * @returns A stable API to drive and introspect the motion lifecycle. See {@link SpotMotionAPI}.
 *
 * @remarks
 * **What it does**
 * - Injects critical CSS variables on the wrapper (`--connector-path`, `--connector-aspect-ratio`)
 *   and scales the overlay layer to the SVG size.
 * - Drives reveal and completion states using class toggles (`is-revealed`, `is-complete`) and
 *   data-attributes (`data-spot-visible`, `data-pulsing`, `data-played`).
 * - When a `brightSpotMode` is provided, stages a clean 0% → 100% run using CSS Motion Path.
 *
 * **Dependencies & observers**
 * - Recomputes layout-side effects when `width`, `height`, or `pathD` change.
 * - If `isRevealed` is not controlled, observes the wrapper class list for `revealedClassName`
 *   via a `MutationObserver`.
 * - Uses a single `ResizeObserver` on the wrapper to keep the bright-spot layer scaled.
 *
 * **Stability & memoization**
 * - Returns a memoized object (`SpotMotionAPI`) so the `ref` identity is stable across renders.
 * - Internal cleanup guards ensure idempotent finalization for `"once"` and `"replay"` modes.
 *
 * **Cleanup**
 * - Detaches `transitionend`/`animationend` listeners, disconnects the `ResizeObserver`,
 *   and resets transient inline styles during cleanup paths.
 *
 * **SSR/CSR**
 * - Uses an isomorphic layout effect (`useLayoutEffect` in the browser, `useEffect` on the server)
 *   to avoid warnings in SSR while still applying pre-paint styles on the client.
 *
 * **Performance notes**
 * - Minimizes reflows: reads layout only to commit staging and to re-arm transitions when needed.
 * - Relies on CSS transitions rather than JS intervals/timers; a short safety timeout is used
 *   only as a fallback if no `animationend` fires.
 *
 * @example
 * ```tsx
 * const { ref, hasPlayed, reset, replay } = useSpotMotionController({
 *   pathD,           // computed SVG path data
 *   width: 360,
 *   height: 200,
 *   isRevealed,      // or omit to observe "is-revealed" on the wrapper
 *   brightSpotMode: 'replay',
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {// ...SVG and bright-spot layer... }
 *   </div>
 * );
 * ```
 *
 * @see {@link SpotMotionOptions}
 * @see {@link SpotMotionAPI}
 */
export function useSpotMotionController({
  pathD,
  width,
  height,
  isRevealed,
  revealedClassName = 'is-revealed',
  completeClassName = 'is-complete',
  brightSpotMode,
  // completeOn = 'brightSpot',
  selectors = { spot: '[data-spot-element]', stroke: '[data-stroke]' },
  ref: externalRef,
}: SpotMotionOptions): SpotMotionAPI {
  // Prefer external ref if provided; otherwise keep an internal one.
  const internalRef = useRef<HTMLElement>(null);
  const ref = externalRef ?? internalRef;

  // Bright spot is considered enabled only when a mode is explicitly set.c
  const spotEnabled = brightSpotMode !== undefined;

  // One-time cleanup guards per mode to avoid duplicate finalization.
  const cleanedRef = useRef<{ replay: boolean; once: boolean }>({
    replay: false,
    once: false,
  });

  // Reveal source of truth (controlled via prop or observed class).
  const [revealed, setRevealed] = useState<boolean>(!!isRevealed);
  // Public flag to indicate a full playthrough has completed.
  const [hasPlayed, setHasPlayed] = useState(false);

  /**
   * Finalizes a run:
   * - Hides the spot appropriately for "replay" vs "once"
   * - Resets inline styles used to stage motion
   * - Removes the animationend listener
   */
  const cleanup = useCallback(
    (handler: (event: AnimationEvent) => void, mode: SpotMotionMode) => {
      const root = ref.current;
      if (!root) return;
      if (cleanedRef.current[mode]) return;
      cleanedRef.current[mode] = true;

      if (mode === 'replay') {
        root.dataset.spotVisible = 'false';
      } else {
        root.dataset.pulsing = 'false';
        root.dataset.spotVisible = 'false';
        root.dataset.played = 'true'; // lock to prevent replay in "once"
      }

      // Reset transient spot styles so future runs start clean.
      const spot = root.querySelector(selectors.spot) as HTMLElement | null;
      if (spot) {
        spot.style.transition = 'none';
        spot.style.setProperty('offset-distance', '0%');
        spot.style.opacity = '0';
        spot.getBoundingClientRect(); // commit style changes
        requestAnimationFrame(() => {
          spot.style.transition = '';
        });
      }

      root.removeEventListener('animationend', handler, true);
    },
    [ref, selectors.spot],
  );

  /**
   * Handles the end of the finishing pulse animation on the bright spot.
   * Ignores unrelated animationend events.
   */
  const handleAnimEnd = useCallback(
    (event: AnimationEvent) => {
      const root = ref.current;
      if (!root) return;
      const spot = root.querySelector(selectors.spot) as HTMLElement | null;
      if (!(event.target instanceof Element)) return;
      if (!spot || event.target !== spot) return; // ne réagit qu’au spot

      const mode: SpotMotionMode = brightSpotMode ?? 'once';
      cleanup(handleAnimEnd, mode);
    },
    [brightSpotMode, cleanup, ref, selectors.spot],
  );

  /**
   * Keeps the bright-spot overlay layer pixel-aligned with the SVG by scaling it
   * to the current wrapper box. Uses a single ResizeObserver.
   */
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const layer = root.querySelector('[data-spot-layer]') as HTMLDivElement | null;
    const apply = () => {
      const sx = root.clientWidth / width || 1;
      const sy = root.clientHeight / height || 1;
      if (layer) layer.style.transform = `translateZ(0) scale(${sx},${sy})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(root);
    return () => ro.disconnect();
  }, [height, ref, width]);

  /**
   * Pre-paint setup:
   * - Inject path and aspect ratio as CSS variables
   * - Mark readiness via data attributes for optional CSS hooks/debug
   */
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.style.setProperty('--connector-aspect-ratio', `${width} / ${height}`);
    root.style.setProperty('--connector-path', `path("${pathD}")`);
    root.setAttribute('data-path', 'true');

    requestAnimationFrame(() => {
      root.setAttribute('data-ready', 'true');
    });
  }, [height, pathD, ref, width]);

  /**
   * Determine the "revealed" state:
   * - Use controlled `isRevealed` when provided
   * - Otherwise, observe the wrapper's class list for `revealedClassName`
   */
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    if (typeof isRevealed === 'boolean') {
      setRevealed(isRevealed);
      return undefined;
    }

    const get = () => root.classList.contains(revealedClassName);
    setRevealed(get());
    const mo = new MutationObserver(() => setRevealed(get()));
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, [isRevealed, revealedClassName, ref]);

  /**
   * Detect real completion via transition end:
   * - Spot enabled → watch `offset-distance` on the spot element
   * - Otherwise     → watch `stroke-dashoffset` on the stroked path
   * Adds the complete class, flips `hasPlayed`, and wires the finishing pulse.
   * Includes a short safety timeout if no animationend fires.
   */
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    // const spotEnabled = brightSpotMode !== undefined;
    const target = spotEnabled
      ? (root.querySelector(selectors.spot) as HTMLElement | null)
      : (root.querySelector(selectors.stroke) as HTMLElement | null);

    if (!target) return undefined;

    const prop = spotEnabled ? 'offset-distance' : 'stroke-dashoffset';

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName !== prop) return;

      root.classList.add(completeClassName);
      setHasPlayed(true);

      // Allow future runs by clearing cleanup guards.
      cleanedRef.current.replay = false;
      cleanedRef.current.once = false;

      // Keep spot visible for the finishing pulse when applicable.
      if (brightSpotMode === 'replay') {
        root.dataset.spotVisible = 'true';
      } else if (brightSpotMode === 'once') {
        root.dataset.pulsing = 'true';
        root.dataset.spotVisible = 'true';
      }

      // Wait for the pulse to finish, then finalize.
      root.addEventListener('animationend', handleAnimEnd, true);

      // Fallback cleanup in case the CSS animation never emits an event.
      if (brightSpotMode) {
        setTimeout(() => cleanup(handleAnimEnd, brightSpotMode), 360); // filet de sécurité si pas d'anim CSS
      }
    };

    target.addEventListener('transitionend', onTransitionEnd);
    return () => target.removeEventListener('transitionend', onTransitionEnd);
  }, [brightSpotMode, cleanup, completeClassName, handleAnimEnd, ref, selectors.spot, selectors.stroke, spotEnabled]);

  /**
   * Rising-edge behavior for `revealed`:
   * - If spot is enabled: stage from 0% (no transition, hidden) to 100% (CSS-controlled)
   * - In "replay": remove completion to re-arm transitions
   */
  const wasRevealedRef = useRef(false);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (root.dataset.played === 'true' && brightSpotMode === 'once') return;

    const prev = wasRevealedRef.current;
    const rising = !prev && revealed;

    // Clear per-mode cleanup guards at each new rising edge.
    if (rising) {
      cleanedRef.current.replay = false;
      cleanedRef.current.once = false;
    }

    if (spotEnabled && rising) {
      const spot = root.querySelector(selectors.spot) as HTMLElement | null;
      if (spot) {
        // Stage a clean run: force initial state, then let CSS drive to 100%.
        root.dataset.spotVisible = 'true';
        root.dataset.spotVisible = 'true';
        spot.style.transition = 'none';
        spot.style.setProperty('offset-distance', '0%');
        spot.style.opacity = '0';
        spot.getBoundingClientRect(); // commit staging

        requestAnimationFrame(() => {
          spot.style.transition = '';
          spot.style.removeProperty('opacity');
          spot.style.setProperty('offset-distance', '100%');
        });
      }
    }

    // Re-arm transitions for replay mode.
    if (rising && brightSpotMode === 'replay') {
      root.classList.remove(completeClassName);
      root.getBoundingClientRect(); // re-arm
      setHasPlayed(false);
    }

    wasRevealedRef.current = revealed;
  }, [brightSpotMode, completeClassName, ref, revealed, selectors.spot, spotEnabled]);

  // Public API: stable ref and simple programmatic controls.
  return useMemo(
    () => ({
      ref,
      hasPlayed,
      reset: () => {
        const root = ref.current;
        if (!root) return;
        delete root.dataset.played;
        root.classList.remove(completeClassName);
        reflow(root); // re-arm transitions
        setHasPlayed(false);
      },
      replay: () => {
        const root = ref.current;
        if (!root) return;
        root.classList.remove(completeClassName);
        reflow(root); // re-arm transitions
        setHasPlayed(false);
      },
    }),
    [completeClassName, hasPlayed, ref],
  );
}
