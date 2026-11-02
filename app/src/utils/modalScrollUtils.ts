/**
 * Finds the active scrolling container for a modal descendant.
 *
 * @param element - Element contained within the modal.
 * @returns The scrolling element, or null when no matching region exists.
 * @remarks The native dialog scrolls at widths up to 48rem; on wider layouts,
 * the inner region identified by data-modal-scroll-region scrolls instead.
 */
export function getModalScrollContainer(element: HTMLElement): HTMLElement | null {
  const dialog = element.closest<HTMLDialogElement>('dialog');

  if (dialog && window.matchMedia('(max-width: 48rem)').matches) {
    return dialog;
  }

  return element.closest<HTMLElement>('[data-modal-scroll-region]');
}

/**
 * Reveals all relevant parts of a focused control within its modal scroller.
 *
 * @remarks
 * - Uses the native dialog on narrow screens and the inner scroll region on desktop.
 * - Intersects the dialog bounds with the visual viewport when a virtual keyboard is present.
 * - Scrolls only when a part of the requested region falls outside the visible area.
 * - If the region is taller than the available space, reveals its nearest edge.
 * - Does not alter focus, document scrolling, or viewport geometry.
 *
 * @param anchor - A descendant of the modal containing the focused control.
 * @param elements - Elements that must remain visible, including floating labels or tooltips.
 * @returns Nothing.
 *
 * @example
 * ensureModalFocusRegionVisible(input, [field, label, tooltip]);
 *
 * @see {@link getModalScrollContainer}
 */
export function ensureModalFocusRegionVisible(
  anchor: HTMLElement,
  elements: readonly (HTMLElement | null | undefined)[],
): void {
  const scrollContainer = getModalScrollContainer(anchor);
  if (!scrollContainer) return;

  const rects = elements
    .filter((element): element is HTMLElement => Boolean(element?.isConnected && element.getClientRects().length))
    .map((element) => element.getBoundingClientRect());

  if (rects.length === 0) return;

  const containerRect = scrollContainer.getBoundingClientRect();
  const visualViewport = scrollContainer instanceof HTMLDialogElement ? window.visualViewport : null;
  const visibleTop = visualViewport ? Math.max(containerRect.top, visualViewport.offsetTop) : containerRect.top;
  const visibleBottom = visualViewport
    ? Math.min(containerRect.bottom, visualViewport.offsetTop + visualViewport.height)
    : containerRect.bottom;

  const margin = 8;
  const availableHeight = visibleBottom - visibleTop - 2 * margin;
  if (availableHeight <= 0) return;

  const regionTop = Math.min(...rects.map((rect) => rect.top));
  const regionBottom = Math.max(...rects.map((rect) => rect.bottom));
  const topOverflow = visibleTop + margin - regionTop;
  const bottomOverflow = regionBottom - (visibleBottom - margin);

  if (topOverflow > 0 && bottomOverflow > 0) {
    // Both ends cannot fit simultaneously: favor the nearest correction.
    scrollContainer.scrollTop += topOverflow <= bottomOverflow ? -topOverflow : bottomOverflow;
  } else if (topOverflow > 0) {
    scrollContainer.scrollTop -= topOverflow;
  } else if (bottomOverflow > 0) {
    scrollContainer.scrollTop += bottomOverflow;
  }
}
