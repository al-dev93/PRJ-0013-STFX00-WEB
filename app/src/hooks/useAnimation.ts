import { useState, useEffect } from 'react';

/**
 * A hook to manage the animation and visibility of a component.
 *
 * @param {boolean} isVisible - Whether the component should be visible or not.
 * @param {number} [delay=300] - The delay in milliseconds before hiding the component if isVisible is false.
 * @returns {{ isAnimating: boolean, shouldRender: boolean }}
 */
export function useAnimation(isVisible: boolean, delay = 300) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    if (isVisible) {
      setShouldRender(true);
      timeoutId = window.setTimeout(() => {
        setIsAnimating(true);
      }, 50);
    } else if (!isVisible && shouldRender) {
      setIsAnimating(false);
      timeoutId = window.setTimeout(() => {
        setShouldRender(false);
      }, delay);
    }
    // cleanup function to clear the timeout when the component is unmounted
    return () => {
      clearTimeout(timeoutId);
    };
  }, [shouldRender, delay, isVisible]);

  return { isAnimating, shouldRender };
}
