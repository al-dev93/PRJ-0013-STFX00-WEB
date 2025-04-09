import React, { Component, ReactNode } from 'react';

import type { FetchErrorContext, Props, State, Window } from '@modules/Error/types';
import { normalizeError } from '@modules/Error/utils/errorHandling';
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
    this.state = {
      hasError: false,
      error: undefined,
      resetKey: 0,
    };
  }

  /**
   * Updates the state when an error is caught in the child component tree.
   * This static method is called during the render phase to derive state from errors.
   *
   * @static
   * @param {unknown} error - The error that was thrown
   * @returns {Partial<State>} - The new state to set
   */
  static getDerivedStateFromError(error: unknown): Partial<State> {
    if (error instanceof Error) {
      return {
        hasError: true,
        error: {
          code: 500,
          name: error.name,
          message: error.message,
          severity: 'critical',
          stack: error.stack,
          timestamp: Date.now(),
        },
      };
    }

    return {
      hasError: true,
      error: {
        code: 500,
        name: 'UnknownError',
        message: 'Unknown or unhandled error',
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
  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    const context: FetchErrorContext = {
      source: 'component',
      stack: info.componentStack,
      url: window.location.href,
    };

    normalizeError(error, context)
      .then((normalizedError) => {
        (window as Window).monitoring?.captureException(normalizedError);
      })
      .catch((normalizationError) => {
        console.error('Error during normalization', normalizationError);
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
    const context: FetchErrorContext = {
      source: 'promise',
      url: window.location.href,
    };

    try {
      const error = await normalizeError(event.reason, context);
      this.setState({
        hasError: true,
        error,
      });

      (window as Window).monitoring?.captureException(error);
    } catch (normalizationError) {
      console.error('Normalization error in handlePromiseRejection : ', normalizationError);
    }
  };

  private handleReset = (): void => {
    const { onReset } = this.props;

    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      resetKey: prevState.resetKey + 1,
    }));

    if (onReset) onReset();
  };

  private renderFallback() {
    const { error } = this.state;
    const { fallback } = this.props;

    return React.isValidElement(fallback)
      ? React.cloneElement(fallback, { error, onReset: this.handleReset })
      : fallback;
  }

  /**
   * Renders the child components or the fallback UI if an error has been caught.
   *
   * @returns {ReactNode} - The child components or the fallback UI
   */
  render(): ReactNode {
    const { hasError, error, resetKey } = this.state;
    const { children } = this.props;

    if (hasError && !error) {
      console.error('Aberrant state detected : hasError = true with no error defined.');

      return (
        <div>
          <p>An unknown error has occurred.</p>
          <button type='button' onClick={this.handleReset}>
            Réessayer
          </button>
        </div>
      );
    }

    return <div key={resetKey}>{hasError ? this.renderFallback() : children}</div>;
  }
}
