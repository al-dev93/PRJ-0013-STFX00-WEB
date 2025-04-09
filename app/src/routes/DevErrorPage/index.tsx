/**
 * ErrorBoundary test page. Intentionally triggers an uncaught
 * React error.
 *
 * @component
 * @export
 * @returns {React.JSX.Element}
 */
export default function DevErrorPage(): React.JSX.Element {
  throw new Error('Simulated React error from /dev-error');
}
