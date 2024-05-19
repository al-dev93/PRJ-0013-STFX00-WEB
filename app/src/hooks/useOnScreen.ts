import { useEffect, useState } from 'react';
/**
 *
 * @description checks if the rootMargin in px of the HTML element passed with sectionRef is visible
 * and stores the result in the boolean state
 * @export
 * @param {React.RefObject<HTMLElement>} sectionRef
 * @param {string} [rootMargin='0px']
 * @return {*}  {boolean}
 */
export function useOnScreen(sectionRef: React.RefObject<HTMLElement>, rootMargin: string = '0px'): boolean {
  // COMMENT: state and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  // COMMENT: creates an intersection observer and stores the result in isIntersecting state
  useEffect(() => {
    const targetElement = sectionRef.current;
    if (!targetElement) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      },
    );
    if (targetElement) {
      observer.observe(targetElement);
    }
    return () => {
      observer.unobserve(targetElement);
    };
  }, [sectionRef, rootMargin]);
  return isIntersecting;
}
