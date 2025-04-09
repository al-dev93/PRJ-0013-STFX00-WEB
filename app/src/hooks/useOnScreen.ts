import { RefObject, useCallback, useEffect, useState } from 'react';

import { AppError } from '@/types';

/**
 * Custom hook to check if an HTML element is visible within the viewport.
 * It uses the IntersectionObserver API to observe changes in the visibility of the target element.
 *
 * @function
 * @param {RefObject<HTMLElement>} ref - The reference to the HTML element that needs to be observed.
 * @param {Object} observerOptions - The options for the IntersectionObserver.
 * @param {string} [observerOptions.rootMargin='0px'] - The margin around the root. Can have values similar to the CSS margin property.
 * @param {number[]} [observerOptions.threshold=[0]] - A list of threshold ratios at which the observer callback should be invoked. Default is [0], meaning the callback is triggered when any part of the target is visible.
 * @returns {boolean} - A boolean value indicating whether the target element is currently visible within the viewport.
 *
 * @al-dev93
 */
export function useOnScreen(
  ref: RefObject<HTMLElement>,
  observerOptions: { rootMargin?: string; threshold?: number[]; observerError?: AppError },
): { isIntersecting: boolean; observerError: AppError | undefined } {
  // State to store whether the target element is visible in the viewport
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  const [observerError, setObserverError] = useState<AppError>();

  /**
   * Callback function that is triggered when the intersection status of the target element changes.
   *
   * @function
   * @param {IntersectionObserverEntry[]} entries - List of IntersectionObserverEntry objects.
   * @param {IntersectionObserver} observer - The observer instance.
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      // If the element is an image (IMG tag), handle it specifically for lazy loading
      if (ref.current?.tagName === 'IMG') {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIntersecting(true); // Mark the image as visible
            observer.disconnect(); // Disconnect observer to stop observing once the image is loaded
          }
        });
        return;
      }
      // For other elements, set the intersecting state based on the first entry
      const [entry] = entries;
      setIntersecting(entry.isIntersecting);
    },
    [ref],
  );

  useEffect(() => {
    const element = ref.current;

    /**
     * If there is no target element or IntersectionObserver is not supported, exit early
     * and sends an error
     */
    if (!element) {
      setObserverError({
        name: 'MissingRefError',
        code: 1001,
        message: 'No DOM reference found for observation',
        severity: 'low',
      });
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      setObserverError({
        name: 'UnsupportedFeatureError',
        code: 1204,
        message: 'IntersectionObserver is not supported in this environment',
        severity: 'low',
      });
      return undefined;
    }

    // Create a new IntersectionObserver instance with the provided callback and options
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Start observing the target element
    observer.observe(element);

    // Cleanup function to stop observing the element and disconnect the observer when the component unmounts
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleIntersection, observerOptions, ref]);

  return { isIntersecting, observerError };
}
