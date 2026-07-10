import { memo, useEffect, useRef } from 'react';

import style from './style .module.css';
import type { HeroSignatureProps } from './types';

export const HeroSignature = memo(function HeroSignature({
  setHasBrandSignaturePlayed,
}: HeroSignatureProps): React.JSX.Element {
  const pathRef = useRef<SVGPathElement | null>(null);
  const spotRef = useRef<SVGGElement | null>(null);
  const maskSpotRef = useRef<SVGGElement | null>(null);
  const brandRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    const spot = spotRef.current;
    const maskSpot = maskSpotRef.current;
    const brandGlow = brandRef.current;

    if (!path || !spot || !maskSpot) return undefined;

    // Respecte prefers-reduced-motion
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      spot.style.display = 'none';
      if (brandGlow) {
        brandGlow.removeAttribute('mask');
      }
      setHasBrandSignaturePlayed(true);
      return undefined;
    }

    const total = path.getTotalLength();
    const duration = 3000; // ms
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const tRaw = (now - start) / duration;
      const tClamped = Math.min(Math.max(tRaw, 0), 1);
      const t = 1 - (1 - tClamped) ** 3;
      // const t = Math.min(Math.max(tRaw, 0), 1);

      // droite -> gauche : on suit le path de son début (droite) vers sa fin (gauche)
      const length = total * t;
      const pt = path.getPointAtLength(length);
      const transform = `translate(${pt.x}, ${pt.y})`;

      spot.setAttribute('transform', transform);
      maskSpot.setAttribute('transform', transform);

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (brandGlow) {
          brandGlow.removeAttribute('mask');
          brandGlow.classList.add(style.heroSignature__brandGlowFinal);
        }
        spot.classList.add(style['heroSignature__brightSpot--done']);
        setHasBrandSignaturePlayed(true);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [setHasBrandSignaturePlayed]);

  return (
    <div className={style.heroSignature}>
      <svg
        className={style.heroSignature__svg}
        version='1.1'
        viewBox='0 0 211.5 80.95'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          {/* very diffuse outer halo */}
          <radialGradient
            id='heroBrightSpotOuter'
            className={style.heroSignature__brightSpotGradient}
            cx='50%'
            cy='50%'
            r='50%'
          >
            {/* center of the outer halo : very light cyan */}
            <stop offset='0%' />
            {/* intermediate zone : even gentler */}
            <stop offset='55%' />
            {/* border : completely transparent */}
            <stop offset='100%' />
          </radialGradient>

          {/* Overall blur very soft on the spot */}
          <filter id='heroBrightSpotSoftGlow' x='-90%' y='-90%' width='280%' height='280%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='2.8' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
          {/* Mask pour la couche glow du logo */}
          <mask id='brandGlowMask' maskUnits='userSpaceOnUse'>
            {/* Tout est masqué par défaut */}
            <rect x='0' y='0' width='211.5' height='80.95' fill='black' />
            {/* Spot de révélation pour la couche glow du logo */}
            <g id='brandGlowMaskSpot' ref={maskSpotRef}>
              {/* même taille globale que ton halo externe, mais en blanc plein */}
              <circle cx='0' cy='0' r='15' fill='white' />
            </g>
          </mask>
        </defs>
        {/* Stylized brand : always visible, very faded */}
        <g id='brandBase' className={style.heroSignature__brandBase}>
          <path
            id='lex'
            d='m172.22 54.278h1.4605v-1.8415h-0.889c-0.508 0-0.78317-0.23283-0.78317-0.762v-12.425h-2.2437v12.637c0 1.6722 0.97367 2.3918 2.4553 2.3918zm8.001 0.254c2.4765 0 4.318-1.397 4.9107-3.4925l-2.3283-0.14817c-0.35983 1.0583-1.2488 1.7145-2.5612 1.7145-1.7992 0-2.921-1.1007-3.0268-3.302h8.0857v-0.5715c0-3.7888-2.0743-5.969-5.1435-5.969-3.2173 0-5.2705 2.3283-5.2705 5.8843 0 3.556 2.0532 5.8843 5.334 5.8843zm-3.0057-6.9215c0.254-1.905 1.3335-2.9422 2.9422-2.9422 1.524 0 2.6247 0.9525 2.7728 2.9422zm8.8265 6.6675h2.54l2.921-4.2968 2.8998 4.2968h2.4977l-4.0428-5.715 3.8735-5.5457h-2.5612l-2.6882 4.0428-2.7728-4.0428h-2.4977l3.9158 5.5033z'
          />
          <path id='dashOfF' d='m150.91 34.031h21.124v3.5311h-21.124z' />
          <path id='fOfFlex' d='m163.06 65.251h3.7588v-46.392h15.662v-2.6008h-19.42z' />
          <path
            id='tack'
            d='m109.78 37.284h2.413v-2.0955h-1.5875c-0.9525 0-1.397-0.33867-1.397-1.397v-5.715h2.9845v-2.0955h-2.9845v-2.6458h-2.7093v2.6458h-1.778v2.0955h1.778v5.969c0 2.2437 1.0372 3.2385 3.2808 3.2385zm7.62 0.254c1.8415 0 3.2808-0.78317 3.8523-1.9897 0.21167 1.3758 1.1218 1.8203 2.3495 1.8203 0.381 0 0.80434-0.0423 0.99484-0.0847v-1.9685h-0.35984c-0.42333 0-0.635-0.16934-0.635-0.78317v-4.1063c0-3.0057-1.6722-4.699-4.8895-4.699-2.794 0-4.6144 1.3547-5.0588 3.7253l2.7517 0.127c0.254-1.143 0.99483-1.7568 2.3072-1.7568 1.4393 0 2.1802 0.8255 2.1802 2.413l-3.7465 0.74083c-2.4765 0.48684-3.683 1.524-3.683 3.4713 0 1.9685 1.5663 3.0903 3.937 3.0903zm0.55033-1.9685c-1.0795 0-1.6722-0.48684-1.6722-1.3758 0-0.78317 0.48683-1.2912 1.6933-1.524l2.921-0.59267v0.635c0 1.7145-1.143 2.8575-2.9422 2.8575zm13.187 1.9685c2.8998 0 4.953-1.7145 5.2705-4.4238l-2.794-0.127c-0.21166 1.5875-1.1642 2.3495-2.4765 2.3495-1.7568 0-2.7517-1.3547-2.7517-3.7042 0-2.3283 0.99483-3.7042 2.7517-3.7042 1.3123 0 2.2437 0.762 2.4765 2.2013l2.794-0.14817c-0.33867-2.6882-2.413-4.2545-5.2705-4.2545-3.3655 0-5.5668 2.3495-5.5668 5.9055 0 3.5772 2.2013 5.9055 5.5668 5.9055zm7.1543-0.254h2.7093v-3.1115l1.778-1.8838 3.302 4.9953h3.048l-4.572-6.604 4.4238-4.699h-3.3443l-4.6355 5.1012v-8.8265h-2.7093z'
          />
          <path
            id='sOfStack'
            d='m95.881 64.842c9.4767 0 16.182-4.3802 16.182-13.923 0-6.7267-4.9172-12.358-10.728-17.364l-13.053-11.263c-4.0231-3.5198-5.2748-6.4138-5.2748-9.6207 0-6.4138 4.9172-9.2296 11.533-9.2296 8.6721 0 11.801 4.3802 12.606 13.297l4.1125-0.86038c-0.89403-11.967-6.9734-15.878-16.808-15.878-9.4767 0-15.914 4.6148-15.914 12.984 0 4.1455 1.8775 8.1346 6.3476 12.045l13.232 11.498c5.9006 5.1623 9.3873 9.0732 9.3873 14.627 0 7.2742-4.3807 10.168-11.533 10.168-9.4767 0-12.069-5.7098-13.321-14.079l-4.2019 1.1732c0.89403 10.012 5.99 16.426 17.434 16.426z'
          />
        </g>

        {/* stylized brand glow : sharper and clearer, only visible under the halo (via the mask) */}
        <g id='brandGlow' ref={brandRef} className={style.heroSignature__brandGlow} mask='url(#brandGlowMask)'>
          <path
            id='lex'
            d='m172.22 54.278h1.4605v-1.8415h-0.889c-0.508 0-0.78317-0.23283-0.78317-0.762v-12.425h-2.2437v12.637c0 1.6722 0.97367 2.3918 2.4553 2.3918zm8.001 0.254c2.4765 0 4.318-1.397 4.9107-3.4925l-2.3283-0.14817c-0.35983 1.0583-1.2488 1.7145-2.5612 1.7145-1.7992 0-2.921-1.1007-3.0268-3.302h8.0857v-0.5715c0-3.7888-2.0743-5.969-5.1435-5.969-3.2173 0-5.2705 2.3283-5.2705 5.8843 0 3.556 2.0532 5.8843 5.334 5.8843zm-3.0057-6.9215c0.254-1.905 1.3335-2.9422 2.9422-2.9422 1.524 0 2.6247 0.9525 2.7728 2.9422zm8.8265 6.6675h2.54l2.921-4.2968 2.8998 4.2968h2.4977l-4.0428-5.715 3.8735-5.5457h-2.5612l-2.6882 4.0428-2.7728-4.0428h-2.4977l3.9158 5.5033z'
          />
          <path id='dashOfF' d='m150.91 34.031h21.124v3.5311h-21.124z' />
          <path id='fOfFlex' d='m163.06 65.251h3.7588v-46.392h15.662v-2.6008h-19.42z' />
          <path
            id='tack'
            d='m109.78 37.284h2.413v-2.0955h-1.5875c-0.9525 0-1.397-0.33867-1.397-1.397v-5.715h2.9845v-2.0955h-2.9845v-2.6458h-2.7093v2.6458h-1.778v2.0955h1.778v5.969c0 2.2437 1.0372 3.2385 3.2808 3.2385zm7.62 0.254c1.8415 0 3.2808-0.78317 3.8523-1.9897 0.21167 1.3758 1.1218 1.8203 2.3495 1.8203 0.381 0 0.80434-0.0423 0.99484-0.0847v-1.9685h-0.35984c-0.42333 0-0.635-0.16934-0.635-0.78317v-4.1063c0-3.0057-1.6722-4.699-4.8895-4.699-2.794 0-4.6144 1.3547-5.0588 3.7253l2.7517 0.127c0.254-1.143 0.99483-1.7568 2.3072-1.7568 1.4393 0 2.1802 0.8255 2.1802 2.413l-3.7465 0.74083c-2.4765 0.48684-3.683 1.524-3.683 3.4713 0 1.9685 1.5663 3.0903 3.937 3.0903zm0.55033-1.9685c-1.0795 0-1.6722-0.48684-1.6722-1.3758 0-0.78317 0.48683-1.2912 1.6933-1.524l2.921-0.59267v0.635c0 1.7145-1.143 2.8575-2.9422 2.8575zm13.187 1.9685c2.8998 0 4.953-1.7145 5.2705-4.4238l-2.794-0.127c-0.21166 1.5875-1.1642 2.3495-2.4765 2.3495-1.7568 0-2.7517-1.3547-2.7517-3.7042 0-2.3283 0.99483-3.7042 2.7517-3.7042 1.3123 0 2.2437 0.762 2.4765 2.2013l2.794-0.14817c-0.33867-2.6882-2.413-4.2545-5.2705-4.2545-3.3655 0-5.5668 2.3495-5.5668 5.9055 0 3.5772 2.2013 5.9055 5.5668 5.9055zm7.1543-0.254h2.7093v-3.1115l1.778-1.8838 3.302 4.9953h3.048l-4.572-6.604 4.4238-4.699h-3.3443l-4.6355 5.1012v-8.8265h-2.7093z'
          />
          <path
            id='sOfStack'
            d='m95.881 64.842c9.4767 0 16.182-4.3802 16.182-13.923 0-6.7267-4.9172-12.358-10.728-17.364l-13.053-11.263c-4.0231-3.5198-5.2748-6.4138-5.2748-9.6207 0-6.4138 4.9172-9.2296 11.533-9.2296 8.6721 0 11.801 4.3802 12.606 13.297l4.1125-0.86038c-0.89403-11.967-6.9734-15.878-16.808-15.878-9.4767 0-15.914 4.6148-15.914 12.984 0 4.1455 1.8775 8.1346 6.3476 12.045l13.232 11.498c5.9006 5.1623 9.3873 9.0732 9.3873 14.627 0 7.2742-4.3807 10.168-11.533 10.168-9.4767 0-12.069-5.7098-13.321-14.079l-4.2019 1.1732c0.89403 10.012 5.99 16.426 17.434 16.426z'
          />
        </g>

        {/* invisible tracer */}
        <path
          id='stroke'
          ref={pathRef}
          className={style.heroSignature__tracer}
          d='m196.37 38.483h-77.526c-17.054 0-58.431 23.132-72.719 25.706s-22.361-1.5378-32.014 2.1167'
        />

        {/* Bright spot with 3 layers */}
        <g id='brightSpot' ref={spotRef} className={style.heroSignature__brightSpot}>
          {/* Outer halo : large, very diffuse */}
          <circle id='outerHalo' cx='0' cy='0' r='15' />

          {/* Intermediate halo : slightly densifies the center, but very subtil */}
          <circle id='midHalo' cx='0' cy='0' r='8.5' />

          {/* Inner halo : a small, slightly brighter area, but still blurry */}
          <circle id='innerHalo' cx='0' cy='0' r='4.2' />
        </g>
      </svg>
    </div>
  );
});
