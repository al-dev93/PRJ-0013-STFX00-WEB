import { Component, ReactNode } from 'react';
import { ErrorInfo } from 'react-dom/client';

import { normalizeError } from '@utils/errorHandling';

import type { Props, State, Window } from '../../types';
import { GlobalErrorFallback } from '../GlobalErrorFallback';
/**
 * A React error boundary component that catches JavaScript errors in its child component tree,
 * logs them, and displays a fallback UI instead of the crashed component tree.
 *
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped by the error boundary
 * @param {ReactNode} [props.fallback] - Custom fallback UI to display when an error occurs
 *
 * @example
 * NOTE: Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example
 * NOTE: With custom fallback
 * <ErrorBoundary fallback={<CustomErrorScreen />}>
 *   <RiskComponent />
 * </ErrorBoundary>
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<Props, State> {
  /**
   * Initializes the component state.
   *
   * @constructor
   * @param {Props} props - Component props
   */
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Updates the state when an error is caught in the child component tree.
   * This static method is called during the render phase to derive state from errors.
   *
   * @static
   * @param {Error} error - The error that was thrown
   * @returns {State} - The new state to set
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        code: 500,
        message: error.message,
        severity: 'critical',
        originalError: error,
      },
    };
  }

  // Gestion des erreurs globales
  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  /**
   * Catches errors thrown in child components
   *
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} info - Component stack trace information
   * @returns {void}
   */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary:', error, info.componentStack);
    (window as Window).monitoring?.captureException(error, {
      componentStack: info.componentStack,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  handlePromiseRejection = (event: PromiseRejectionEvent) => {
    this.setState({
      hasError: true,
      error: normalizeError(event.reason),
    });
  };

  /**
   * Renders the child components or the fallback UI if an error has been caught.
   *
   * @returns {ReactNode} - The child components or the fallback UI
   */
  render(): ReactNode {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return fallback || <GlobalErrorFallback error={error} />;
    }
    return children;
  }
}
