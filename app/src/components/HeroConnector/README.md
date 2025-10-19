# HeroConnector

A lightweight SVG connector that draws a smoothed polyline between `{from, via?, to}` points, with optional glow, dash-reveal, and a traveling **bright spot**. Animation is driven by CSS with a small hook that bridges runtime state to DOM attributes and CSS variables.

---

## Installation

```tsx
import { HeroConnector } from './HeroConnector';
import type { HeroConnectorProps } from './types';
```

---

## Quick start

```tsx
<HeroConnector
  from={{ x: 24, y: 48 }}
  to={{ x: 280, y: 96 }}
  width={320}
  height={160}
/>
```

With waypoints + defaults (explicit for clarity):

```tsx
<HeroConnector
  from={{ x: 40, y: 12 }}
  via={[{ x: 40, y: 160 }, { x: 220, y: 160 }]}
  to={{ x: 320, y: 280 }}
  width={360}
  height={220}
  cornerRadius={28}   // @default 28
  glow                 // @default true
  animated             // @default true
/>
```

---

## Props

| Name | Type | Required | Description |
|---|---|:---:|---|
| `from` | `Point` | ✅ | Start coordinate of the connector (first vertex). |
| `via` | `Point[]` | ❌ | Optional ordered waypoints the connector must pass through. |
| `to` | `Point` | ✅ | End coordinate of the connector; also anchors the terminal dot. |
| `width` | `number` | ✅ | SVG viewport width (pixels). |
| `height` | `number` | ✅ | SVG viewport height (pixels). |
| `cornerRadius` | `number` | ❌ | Uniform corner radius for each joint. **Default:** `28`. |
| `radiiXY` | `[number, number][]` | ❌ | Per-corner radii as `[rx, ry]` pairs; overrides `cornerRadius` when specified. |
| `glow` | `boolean` | ❌ | Enables the glow underlay. **Default:** `true`. |
| `animated` | `boolean` | ❌ | Enables dash-reveal animation. **Default:** `true`. |
| `bloomEnabled` | `boolean` | ❌ | Enables the wide bloom trail under the bright spot (effective when `animated` and `brightSpotMode` are set). **Default:** `true`. |
| `brightSpotMode` | `'once' \| 'replay'` | ❌ | Enables the bright spot and defines its replay behavior. Omit to disable. |
| `isRevealed` | `boolean` | ❌ | Controlled reveal flag; when omitted the hook observes the wrapper class. |
| `className` | `string` | ❌ | Additional class name(s) on the outer wrapper for theming/layout. |
| `onPathComputed` | `(d: string) => void` | ❌ | Callback invoked with the computed path data string. |

> `Point` is `{ x: number; y: number }` in the component coordinate space (`0..width`, `0..height`).

---

## Hook API (advanced)

For custom compositions, you can wire the motion yourself with the hook.

```tsx
import { useSpotMotionController } from './useSpotMotionController';
import type { SpotMotionOptions, SpotMotionAPI } from './types';

const { ref, hasPlayed, reset, replay } = useSpotMotionController({
  pathD,            // SVG path data ("d")
  width: 360,
  height: 200,
  // isRevealed, revealedClassName, completeClassName,
  // brightSpotMode: 'once' | 'replay',
  // selectors: { spot: '[data-spot-element]', stroke: '[data-stroke]' },
});
```

Attach `ref` to the wrapper hosting the SVG and the spot layer.

---

## State model & data attributes

The component and hook expose a small set of attributes/classes to drive CSS:

| Name | Element | Description |
|---|---|---|
| `data-animated="true"` | `<svg>` | Enables stroke dash-reveal on the main path. |
| `data-glow="true"` | `<svg>` | Shows the glow underlay beneath the path. |
| `data-spot="true"` | `<svg>` | Renders the bright-spot structure (overlay layer). |
| `data-bloom="true"` | `<svg>` | Shows the wide bloom trail under the bright spot. |
| `.is-revealed` | `.heroConnectorWrap` | Triggers dash offsets to animate toward `0` (stroke and bloom). |
| `.is-complete` | `.heroConnectorWrap` | Marks end-of-run; used for the finishing pulse. |
| `data-spot-visible="true"` | `.heroConnectorWrap` | Makes the bright spot visible (opacity on). |
| `data-pulsing="true"` | `.heroConnectorWrap` | Keeps the bright spot visible during the pulse window. |
| `data-played="true"` | `.heroConnectorWrap` | Lockout for `brightSpotMode="once"`; prevents replays until `reset()`. |

> Tip: Control reveal via the `isRevealed` prop **or** by toggling `.is-revealed` on the wrapper.

---

## Theming tokens (CSS custom properties)

The following tokens live on `.heroConnectorWrap` for easy theming.

| Variable | Feature | Default | Usage |
|---|---|---|---|
| `--connector-stroke-color` | Stroke | `color-mix(in oklab, var(--brand, #2456a6) 78%, var(--white) 28%)` | Main stroke color. |
| `--connector-stroke-width` | Stroke | `clamp(2px, 0.25vw, 6px)` | Stroke thickness. |
| `--connector-stroke-linecap` | Stroke | `round` | Line cap for path ends. |
| `--connector-stroke-linejoin` | Stroke | `round` | Line join for corners. |
| `--connector-stroke-opacity` | Stroke | `1` | Stroke alpha. |
| `--connector-dash` | Stroke | `100` | Dash model length (matches `pathLength=100`). |
| `--connector-dash-offset-start` | Stroke | `100` | Initial dash offset (fully hidden). |
| `--connector-dot-r` | Stroke | `calc(var(--connector-stroke-width) * 0.9)` | Terminal dot radius. |
| `--connector-glow-color` | Glow | `color-mix(in oklab, var(--connector-bright-spot-color) 40%, var(--white) 60%)` | Glow stroke color. |
| `--connector-glow-width` | Glow | `clamp(8px, 0.9vw, 14px)` | Glow stroke width (wider than main). |
| `--connector-glow-opacity` | Glow | `0.35` | Glow alpha. |
| `--connector-glow-blur` | Glow | `drop-shadow(0 2px 6px rgba(0,0,0,.12))` | Subtle blur/blur-like effect. |
| `--connector-bright-spot-color` | BrightSpot | `var(--primary-color)` | Base hue for spot & bloom. |
| `--connector-bright-spot-size` | BrightSpot | `15px` | Bright spot core diameter. |
| `--connector-bright-spot-intensity` | BrightSpot | `1.1` | Intensity multiplier for glows. |
| `--connector-bright-spot-bloom` | BrightSpot | `23px` | Near bloom radius. |
| `--connector-bright-spot-aura` | BrightSpot | `72px` | Far aura radius. |
| `--connector-bright-spot-core` | BrightSpot | `0.96` | Core opacity. |
| `--connector-bright-spot-lag` | BrightSpot | `800ms` | Trail lag vs. stroke animation. |
| `--connector-bright-spot-fade-in-delay` | BrightSpot | `100ms` | Spot appear delay. |
| `--connector-radius` | Corner | `18px` | Optional CSS-only corner rounding helper. |
| `--connector-anim-duration` | Animation | `1000ms` | Shared transition duration. |
| `--connector-anim-ease` | Animation | `cubic-bezier(0.22, 1, 0.36, 1)` | Shared easing. |
| `--connector-anim-delay` | Animation | `200ms` | Shared delay. |
| `--connector-aspect-ratio` | Injected | *(set by hook)* | Wrapper aspect ratio. |
| `--connector-path` | Injected | *(set by hook)* | Motion path for the bright spot (CSS `offset-path`). |

---

## Accessibility

- The `<svg>` is **decorative** and intentionally rendered with `aria-hidden="true"` and `focusable="false"`.
- Respect `prefers-reduced-motion: reduce`: CSS disables dash animations and places the spot at the end (`offset-distance: 100%`).
- Do not use the connector to convey essential information without a textual alternative.

---

## Performance notes

- Geometry (path rounding) runs in O(n) for n points; the heavy lifting is CSS (GPU-friendly transforms, transitions).
- The hook minimizes reflows, using them only to **stage** transitions and to **re-arm** them after removing classes.
- A `ResizeObserver` keeps the spot layer scaled to the SVG; a `MutationObserver` is used only when `isRevealed` is uncontrolled.
- No timers for the main motion; a short **safety timeout** finalizes cleanup if no `animationend` event fires.

---

## Troubleshooting

- **No motion?** Ensure `.is-revealed` is applied (or `isRevealed` is `true`) and `data-animated="true"` is present.
- **Bright spot not visible?** Provide `brightSpotMode` (`'once' | 'replay'`) and check `data-spot="true"`. In `"once"`, the spot won’t replay after `data-played="true"` unless you call `reset()`.
- **Wrong aspect ratio?** The hook sets `--connector-aspect-ratio`; make sure the wrapper exists and the `ref` is attached.
- **Waypoints look sharp?** Provide `radiiXY` pairs for selected corners or increase `cornerRadius`.

---

## Example with bright spot

```tsx
<HeroConnector
  from={{ x: 40, y: 12 }}
  to={{ x: 320, y: 280 }}
  width={360}
  height={220}
  animated
  glow
  // enable bright spot and bloom
  brightSpotMode="replay"
  className="my-connector"
/>
```
