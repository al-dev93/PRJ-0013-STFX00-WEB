import { useEffect, useState } from 'react';

import type { AppError } from '@/types';
/**
 * A hook to manage the animation and visibility of a component.
 *
 * @param {boolean} isVisible - Whether the component should be visible or not.
 * @param {number} [delay=300] - The delay in milliseconds before hiding the component if isVisible is false.
 * @returns {{ isAnimating: boolean, shouldRender: boolean }}
 */
export function useAnimation(
  isVisible: boolean,
  delay: number = 300,
): { isAnimating: boolean; shouldRender: boolean; animationError?: AppError } {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationError, setAnimationError] = useState<AppError>();

  useEffect(() => {
    let timeoutId: number | undefined;

    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<void>}
     */
    const handleAnimation = async (): Promise<void> => {
      try {
        if (isVisible) {
          setShouldRender(true);
          timeoutId = window.setTimeout(() => {
            try {
              // throw new Error('test isAnimating');
              setIsAnimating(true);
            } catch (err) {
              setAnimationError({
                ...(err as AppError),
                code: 1005,
                message: 'Error in set animating',
                severity: 'low',
              });
            }
          }, 50);
        } else if (!isVisible && shouldRender) {
          setIsAnimating(false);
          timeoutId = window.setTimeout(() => {
            setShouldRender(false);
          }, delay);
        }
      } catch (err) {
        setAnimationError({
          ...(err as AppError),
          message: 'Error in set should render',
          code: 1005,
          severity: 'low',
        });
      }
    };

    handleAnimation();

    // cleanup function to clear the timeout when the component is unmounted
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldRender, delay, isVisible]);

  return { isAnimating, shouldRender, animationError };
}
