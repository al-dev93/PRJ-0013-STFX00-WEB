import { Component } from 'react';
import { ErrorInfo } from 'react-dom/client';

import { normalizeError } from '@utils/errorHandling';

import type { Props, State, Window } from '../../types';
import { GlobalErrorFallback } from '../GlobalErrorFallback';
/**
 * Description placeholder
 *
 * @export
 * @class ErrorBoundary
 * @typedef {ErrorBoundary}
 * @extends {Component<Props, State>}
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

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

  componentDidCatch(error: Error, info: ErrorInfo) {
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

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return fallback || <GlobalErrorFallback error={error} />;
    }
    return children;
  }
}
