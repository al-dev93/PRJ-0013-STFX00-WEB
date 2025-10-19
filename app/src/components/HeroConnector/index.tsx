import { LegacyRef, memo, useMemo } from 'react';

import type { Point } from '@/types';

import style from './style.module.css';
import type { HeroConnectorProps } from './types';
import { useSpotMotionController } from './useSpotMotionController';

/**
 * Builds an SVG path data string for a polyline with rounded joints.
 *
 * @remarks
 * - **Coordinate system**: standard SVG screen coordinates (x → right, y → down).
 * - **Corner rounding**: each interior vertex is replaced by an arc. If `radiiXY` is provided,
 *   its per-corner `[rx, ry]` values take precedence; otherwise `cornerRadius` is used (circular).
 * - **Safety**: the effective inset distance is clamped so the arc never exceeds half of either
 *   adjacent segment length, preventing over-shoots and self-intersections.
 * - **Edge cases**: degenerate corners (zero-length adjacent segment) are bridged by a straight `L`.
 * - **Complexity**: O(n) time and O(1) extra space for n = `poly.length` (excluding output string).
 *
 * @param poly - Ordered polyline vertices (at least two points). The path starts at `poly[0]` and ends at `poly[n-1]`.
 * @param cornerRadius - Default circular radius (pixels) used when `radiiXY` does not provide a value for a corner.
 * @param radiiXY - Optional per-corner elliptical radii as `[rx, ry]` pairs, applied to interior corners in order.
 *   Entry `i` (0-based) corresponds to the corner at `poly[i+1]` (between segments `[i→i+1]` and `[i+1→i+2]`).
 *
 * @returns A valid SVG path data string (`M`, `L`, `A`). Returns an empty string when `poly.length < 2`.
 *
 * @example
 * ```ts
 * // A path with mixed circular and elliptical corners
 * const d = buildRoundedPath(
 *   [
 *     { x: 40,  y: 12 },
 *     { x: 40,  y: 160 },
 *     { x: 220, y: 160 },
 *     { x: 220, y: 280 },
 *     { x: 320, y: 280 },
 *   ],
 *   28,
 *   [[12, 12], [18, 10], [8, 18]]
 * );
 * ```
 *
 * @see https://svgwg.org/specs/paths/#PathDataEllipticalArcCommands
 */
function buildRoundedPath(poly: Point[], cornerRadius: number, radiiXY?: Array<[number, number]>): string {
  // Fast-exit: nothing to draw if fewer than 2 vertices.
  if (!poly || poly.length < 2) return '';

  // Start the path at the first vertex.
  const out: string[] = [`M ${poly[0].x} ${poly[0].y}`];

  // Iterate over interior vertices: each (p1) may become a rounded corner.
  for (let i = 1; i < poly.length - 1; i += 1) {
    const p0 = poly[i - 1];
    const p1 = poly[i];
    const p2 = poly[i + 1];

    // Build incoming/outgoing vectors around p1 and their lengths.
    const vIn = { x: p0.x - p1.x, y: p0.y - p1.y };
    const vOut = { x: p2.x - p1.x, y: p2.y - p1.y };
    const lenIn = Math.hypot(vIn.x, vIn.y);
    const lenOut = Math.hypot(vOut.x, vOut.y);

    if (lenIn === 0 || lenOut === 0) {
      // Degenerate case: if any adjacent segment collapses, pass straight through p1.
      out.push(`L ${p1.x} ${p1.y}`);
    } else {
      // Pick radii for this corner: use per-corner `[rx, ry]` when provided, else fallback to circular `cornerRadius`.
      const idx = i - 1; // corner index for interior vertex at poly[i]
      const [rxRaw, ryRaw] = radiiXY && radiiXY[idx] ? radiiXY[idx] : [cornerRadius, cornerRadius];

      // Clamp the effective inset to avoid exceeding half of either adjacent segment.
      // This guarantees the arc fits without overshooting or self-intersections.
      const eff = Math.min(Math.min(rxRaw, ryRaw), lenIn / 2, lenOut / 2);

      // Normalize directions to compute tangency points along each segment.
      const nIn = { x: vIn.x / lenIn, y: vIn.y / lenIn };
      const nOut = { x: vOut.x / lenOut, y: vOut.y / lenOut };

      // Entry/exit points where the straight segments meet the arc.
      const entry = { x: p1.x + nIn.x * eff, y: p1.y + nIn.y * eff };
      const exit = { x: p1.x + nOut.x * eff, y: p1.y + nOut.y * eff };

      // Determine sweep using the 2D cross product sign.
      // Note: SVG coordinates have y growing downward.
      const z = vIn.x * vOut.y - vIn.y * vOut.x;
      const sweep = z < 0 ? 1 : 0;

      // Draw the straight segment up to the arc entry, then the elliptical arc to the exit.
      out.push(`L ${entry.x} ${entry.y}`);
      out.push(`A ${rxRaw} ${ryRaw} 0 0 ${sweep} ${exit.x} ${exit.y}`);
    }
  }

  // Finally, draw the straight segment to the last vertex.
  const last = poly[poly.length - 1];
  out.push(`L ${last.x} ${last.y}`);

  // Join all commands into a valid SVG path data string.
  return out.join(' ');
}

/**
 * Renders a rounded SVG connector to visually link elements in a hero layout.
 *
 * @remarks
 * **Purpose** — Draws a smooth polyline (with circular/elliptical joints) inside an SVG.
 * **Accessibility** — Decorative graphic: the `<svg>` is rendered with `aria-hidden="true"` and `focusable="false"`.
 * **Styling hooks** — The root `<svg>` surfaces data attributes for CSS-driven effects:
 * `data-animated`, `data-glow`, `data-spot`, and `data-bloom`. The wrapper exposes
 * class toggles such as `is-revealed` / `is-complete` (managed by the hook) and can
 * be themed via CSS variables (e.g., `--connector-stroke-width`, `--connector-path`,
 * `--connector-aspect-ratio`).
 * **Geometry** — The connector is generated from `{from, via?, to}` in the component’s
 * coordinate space (`0..width`, `0..height`), and sized by the provided `width`/`height`.
 * Corners are rounded by a uniform radius or optional per-corner `[rx, ry]` pairs.
 * **Animation & state** — When enabled, the stroke animates with a dash-reveal; an optional
 * “bright spot” can travel along the path and a bloom trail can be shown beneath it.
 * The internal hook synchronizes completion, replay/once modes, and DOM data attributes.
 * **Defaults** — Runtime defaults match the props contract:
 * `cornerRadius = 28`, `glow = true`, `animated = true`.
 *
 * @example
 * ```tsx
 * // Minimal usage
 * <HeroConnector
 *   from={{ x: 24, y: 48 }}
 *   to={{ x: 280, y: 96 }}
 *   width={320}
 *   height={160}
 * />
 *
 * // With waypoints and animation controls
 * <HeroConnector
 *   from={{ x: 40, y: 12 }}
 *   via={[{ x: 40, y: 160 }, { x: 220, y: 160 }]}
 *   to={{ x: 320, y: 280 }}
 *   width={360}
 *   height={220}
 *   // defaults shown for clarity:
 *   cornerRadius={28}
 *   glow
 *   animated
 * />
 * ```
 *
 * @see {@link HeroConnectorProps}
 */
export const HeroConnector = memo(function HeroConnector({
  from,
  via,
  to,
  width,
  height,
  cornerRadius = 28,
  radiiXY,
  glow = true,
  animated = true,
  bloomEnabled,
  brightSpotMode,
  isRevealed,
  className,
}: HeroConnectorProps): React.JSX.Element {
  // Compute a stable SVG path (`d`) from the polyline.
  // Recompute only when geometry inputs change.
  const d = useMemo(() => {
    const poly = [from, ...(via ?? []), to];
    return buildRoundedPath(poly, cornerRadius, radiiXY);
  }, [from, to, via, cornerRadius, radiiXY]);

  // Feature flags derived from props:
  // - bright spot is enabled only if animation is on AND a mode is provided.
  // - bloom depends on animation + explicit override (defaults to true).
  const spotEnabled = animated && brightSpotMode !== undefined;
  const isBloomed = animated && (bloomEnabled ?? true) && spotEnabled;

  // Wire the motion controller:
  // - injects `--connector-path`, aspect ratio, and data flags on the wrapper
  // - manages reveal/completion and bright-spot playthrough
  const { ref } = useSpotMotionController({
    pathD: d,
    width,
    height,
    isRevealed,
    brightSpotMode,
  });

  return (
    <div className={className ?? ''}>
      {/* Wrapper observed by the hook; `is-revealed` can be controlled externally */}
      <div
        className={`${style.heroConnectorWrap} ${isRevealed ? 'is-revealed' : ''}`}
        ref={ref as LegacyRef<HTMLDivElement>}
      >
        {/* Decorative SVG. Data attributes expose feature toggles to CSS. */}
        <svg
          className={style.heroConnector}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden='true'
          focusable='false'
          data-animated={animated ? 'true' : 'false'}
          data-glow={glow ? 'true' : 'false'}
          data-spot={spotEnabled ? 'true' : 'false'}
          data-bloom={isBloomed ? 'true' : 'false'}
          preserveAspectRatio='none'
        >
          {/* Optional halo under the stroke; shown when `data-glow="true"` */}
          <path className={style.heroConnector__glow} d={d} pathLength={100} />

          {/* Optional wide trail synced with the bright spot; shown when `data-bloom="true"` */}
          <path className={style.heroConnector__bloomTrail} d={d} pathLength={100} />

          {/* Main visible stroke. CSS handles dash-reveal when animated. */}
          <path className={style.heroConnector__stroke} d={d} pathLength={100} data-stroke />

          {/* Terminal dot at the end of the path (purely decorative). */}
          <circle className={style.heroConnector__dot} cx={to.x} cy={to.y} />
        </svg>

        {/* Overlay layer that hosts the bright spot; scaled by the hook to match the SVG */}
        <div className={style.heroConnector__spotLayer} data-spot-layer>
          {/* Element animated along `--connector-path` via CSS motion-path */}
          <div className={style.heroConnector__brightSpot} data-spot-element>
            <span className={style.halo} />
          </div>
        </div>
      </div>
    </div>
  );
});
