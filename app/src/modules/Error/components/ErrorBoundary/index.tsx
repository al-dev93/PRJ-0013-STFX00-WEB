import React, { Component, ReactNode } from 'react';
import { ErrorInfo } from 'react-dom/client';

import type { Props, State, Window } from '@modules/Error/types';
import { normalizeError, normalizeErrorSync } from '@modules/Error/utils/errorHandling';

import { AppErrorFallback } from '../AppErrorFallback';
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
  private resetKey = 0;

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
        ...error,
        code: 500,
        severity: 'critical',
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Sets up global error handlers when the component is mounted.
   * This method adds an event listener to catch unhandled promise rejections.
   *
   * @example
   * NOTE: Called automatically by React when the component mounts
   * componentDidMount();
   */
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
    if (error.name === 'AbortError') {
      console.log('Requête annulée (comportement normal)');
      return;
    }
    // console.error('ErrorBoundary:', error, info.componentStack);
    const currentUrl = window.location.href;
    const normalized = normalizeErrorSync(error, {
      source: 'component',
      url: currentUrl,
      method: 'RENDER',
      stack: info.componentStack,
      originalError: error,
    });

    this.setState({
      hasError: true,
      error: normalized,
    });

    (window as Window).monitoring?.captureException(normalized, {
      tags: {
        route: currentUrl,
        component: 'ErrorBoundary',
      },
    });
  }

  /**
   * Cleans up global error handlers when the component is unmounted.
   * This method removes the event listener for unhandled promise rejections.
   *
   * @example
   * NOTE: Called automatically by React when the component unmounts
   * componentWillUnmount();
   */
  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  /**
   * Handles unhandled promise rejections by updating the component state.
   * This method is called when a promise is rejected but not caught by any `.catch()` handler.
   *
   * @param {PromiseRejectionEvent} event - The event containing the rejected promise and reason
   *
   * @example
   * NOTE: Called automatically when an unhandled promise rejection occurs
   * handlePromiseRejection(event);
   */
  handlePromiseRejection = async (event: PromiseRejectionEvent) => {
    this.setState({
      hasError: true,
      error: await normalizeError(event.reason),
    });
  };

  private handleReset = () => {
    const { onReset } = this.props;
    this.resetKey += 1;
    this.setState({ hasError: false, error: undefined });
    if (onReset) onReset();
  };

  private renderFallback() {
    const { error } = this.state;
    const { fallback, onReset } = this.props;

    return React.isValidElement(fallback) ? (
      React.cloneElement(fallback, { error, onReset: onReset || this.handleReset })
    ) : (
      <AppErrorFallback error={error} onReset={onReset || this.handleReset} />
    );
  }

  /**
   * Renders the child components or the fallback UI if an error has been caught.
   *
   * @returns {ReactNode} - The child components or the fallback UI
   */
  render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;
    return <div key={this.resetKey}>{hasError ? this.renderFallback() : children}</div>;

    // if (hasError) {
    //   const fallbackWithReset = React.isValidElement(fallback) ? (
    //     React.cloneElement(fallback, { onReset: onReset || this.handleReset })
    //   ) : (
    //     <AppErrorFallback error={error as Error} onReset={onReset || this.handleReset} />
    //   );

    //   return fallbackWithReset;
    // }
    // return children;
  }
}
