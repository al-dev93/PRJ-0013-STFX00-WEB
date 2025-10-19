import { RefObject } from 'react';

import type { Point } from '@/types';

/**
 * Props for the {@link HeroConnector} component.
 * @remarks
 * All coordinates are expressed in the SVG viewport space defined by `width` × `height` (CSS pixels).
 */
export interface HeroConnectorProps {
  /**
   * Start point of the connector polyline.
   * The path generation begins at this coordinate.
   * @see {@link HeroConnector}
   */
  from: Point;

  /**
   * Optional ordered waypoints that the connector must pass through.
   * If provided, the path is built as `from → ...via → to` with rounded joints.
   * @see {@link HeroConnector}
   */
  via?: Point[];

  /**
   * End point of the connector polyline.
   * Also used to position the terminal dot decoration.
   * @see {@link HeroConnector}
   */
  to: Point;

  /**
   * SVG viewport width.
   * Used for the `<svg width>` and the `viewBox` computation.
   * @units pixels
   */
  width: number;

  /**
   * SVG viewport height.
   * Used for the `<svg height>` and the `viewBox` computation.
   * @units pixels
   */
  height: number;

  /**
   * Uniform corner radius applied at each interior joint of the polyline.
   * Overridden per-corner by {@link HeroConnectorProps.radiiXY} when specified.
   * @units pixels
   * @defaultValue 28
   */
  cornerRadius?: number;

  /**
   * Optional per-corner elliptical radii, as `[rx, ry]` pairs, applied
   * in the order of interior joints. Missing or extra entries are ignored.
   * When present for a given corner, this overrides {@link HeroConnectorProps.cornerRadius}.
   * @units pixels
   */
  radiiXY?: Array<[number, number]>;

  /**
   * Enables a soft halo/blur under the main stroke for emphasis.
   * Also reflected to the DOM via `data-glow` for theme-driven styles.
   * @defaultValue true
   */
  glow?: boolean;

  /**
   * Enables dash-reveal / progressive drawing animations.
   * Also reflected to the DOM via `data-animated` so CSS can control motion.
   * @defaultValue true
   */
  animated?: boolean;

  /**
   * Enables the wide “bloom” trail that accompanies the bright spot animation.
   * Effective only when `animated` is true and a {@link HeroConnectorProps.brightSpotMode} is set.
   * @defaultValue true
   */
  bloomEnabled?: boolean;

  /**
   * Controls the reveal state externally. When omitted, the hook observes the
   * wrapper’s class list and treats the presence of `"is-revealed"` as the source of truth.
   */
  isRevealed?: boolean;

  /**
   * Bright-spot behavior along the path:
   * - `"once"`: plays a single time and then disables itself,
   * - `"replay"`: replays each time the section is revealed again.
   * Omit to disable the bright spot entirely.
   */
  brightSpotMode?: SpotMotionMode;

  /**
   * Additional CSS class name(s) applied to the component’s outer wrapper element.
   * Useful to scope layout or theming at the container level.
   */
  className?: string;

  /**
   * Callback invoked after the SVG path data (`d`) is computed.
   * Useful for diagnostics, analytics, or custom measurements.
   * @param d - The computed SVG path data string.
   */
  onPathComputed?: (d: string) => void;
}

/**
 * Bright-spot playback strategy along the connector path.
 *
 * - `"once"`: plays a single time the first time the connector is revealed,
 *   then sets an internal lock so subsequent reveals do not replay the spot.
 * - `"replay"`: replays the bright-spot motion every time the connector
 *   becomes revealed again (after removing the complete state).
 *
 * @remarks
 * When omitted in component/options, the bright spot is disabled entirely.
 * The hook also mirrors some states via data-attributes on the wrapper
 * (e.g., `data-played`, `data-spot-visible`, `data-pulsing`).
 */
export type SpotMotionMode = 'once' | 'replay';

/**
 * Source used to detect the end of the main animation.
 *
 * - `"brightSpot"`: completion is driven by the bright-spot motion
 *   (listening to the `offset-distance` transition on the spot element).
 * - `"stroke"`: completion is driven by the stroke dash animation
 *   (listening to the `stroke-dashoffset` transition on the path).
 *
 * @remarks
 * Internally, this maps to the observed CSS property via a lookup
 * (see `EndPropMap`), which is used to filter `transitionend` events.
 */
type CompletionTrigger = 'brightSpot' | 'stroke';

/**
 * CSS selectors used by the hook to locate the animated elements.
 *
 * @example
 * ```ts
 * const selectors: PathSelector = {
 *   spot: '[data-spot-element]',
 *   stroke: '[data-stroke]',
 * };
 * ```
 */
type PathSelector = {
  /**
   * Selector targeting the bright-spot element that rides the path.
   * Expected to match a single element within the wrapper.
   * @example "[data-spot-element]"
   */
  spot: string;

  /**
   * Selector targeting the stroked path whose dash animation reveals the line.
   * Expected to match the main `<path>` element.
   * @example "[data-stroke]"
   */
  stroke: string;
};

export interface SpotMotionOptions {
  /**
   * SVG path data (`d`) used as the motion path for the bright spot.
   * Injected into the wrapper as the CSS variable `--connector-path`.
   * @see {@link useSpotMotionController}
   */
  pathD: string;

  /**
   * Viewport width used to size the SVG wrapper and compute scaling for the
   * bright-spot overlay layer.
   * @units pixels
   */
  width: number;

  /**
   * Viewport height used to size the SVG wrapper and compute scaling for the
   * bright-spot overlay layer.
   * @units pixels
   */
  height: number;

  /**
   * Controls the reveal state externally. When omitted, the hook observes the
   * wrapper’s class list and treats `revealedClassName` as the source of truth.
   * @defaultValue undefined (observes CSS class)
   */
  isRevealed?: boolean;

  /**
   * Class name that indicates the connector section is revealed when the
   * hook is not controlled via {@link SpotMotionOptions.isRevealed}.
   * @defaultValue "is-revealed"
   */
  revealedClassName?: string;

  /**
   * Class name added when the reveal/bright-spot sequence has completed.
   * Used to gate replay behavior and CSS end-state.
   * @defaultValue "is-complete"
   */
  completeClassName?: string;

  /**
   * Bright-spot behavior along the path. When omitted, the bright spot is
   * disabled entirely (stroke reveal may still run if `animated` is true).
   * @see {@link SpotMotionMode}
   * @defaultValue undefined (disabled)
   */
  brightSpotMode?: SpotMotionMode;

  /**
   * Source used to detect the real end of the animation sequence.
   * `"brightSpot"` listens to the spot’s `offset-distance`; `"stroke"` listens
   * to the path’s `stroke-dashoffset`.
   * @see {@link CompletionTrigger}
   * @defaultValue "brightSpot"
   */
  completeOn?: CompletionTrigger;

  /**
   * CSS selectors used to locate the animated elements inside the wrapper.
   * `spot` targets the bright-spot element; `stroke` targets the stroked path.
   * @see {@link PathSelector}
   * @example { spot: "[data-spot-element]", stroke: "[data-stroke]" }
   * @defaultValue { spot: "[data-spot-element]", stroke: "[data-stroke]" }
   */
  selectors?: PathSelector;

  /**
   * Optional external ref to the wrapper element. If omitted, the hook manages
   * its own internal ref and exposes it via the returned API.
   * @defaultValue undefined
   */
  ref?: RefObject<HTMLElement>;
}

/**
 * Public API returned by {@link useSpotMotionController}.
 */
export type SpotMotionAPI = {
  /**
   * Stable ref to the wrapper element that hosts the SVG and the bright-spot layer.
   * Attach this ref to the component’s outer wrapper so the hook can inject CSS
   * variables, observe classes, and bind listeners.
   */
  ref: React.RefObject<HTMLElement>;

  /**
   * Indicates whether a full motion cycle has completed at least once
   * since the last {@link SpotMotionAPI.reset} / {@link SpotMotionAPI.replay}.
   * Useful for gating UI that depends on the end state of the animation.
   */
  hasPlayed: boolean;

  /**
   * Clears the "played" lock and end-state, then re-arms transitions.
   *
   * @remarks
   * - Removes the `is-complete` class and the `data-played` lock.
   * - Forces a layout read (reflow) to commit the reset state.
   * - Use this to allow a new playthrough even when the hook previously
   *   ran in `"once"` mode.
   */
  reset: () => void;

  /**
   * Re-arms transitions for another run without clearing the "played" lock.
   *
   * @remarks
   * - Removes the `is-complete` class and forces a layout read (reflow).
   * - Does **not** delete the `data-played` lock; in `"once"` mode, the
   *   bright spot remains locked unless {@link SpotMotionAPI.reset} is used.
   * - Intended for `"replay"` mode or when only the stroke reveal needs re-running.
   */
  replay: () => void; // réarme les transitions (enlève complete + reflow)
};
