import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree,
 * logs them, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              The application encountered an error. You can try refreshing the page or return to the dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              
              <Link
                to="/dashboard?fallback=true"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-center"
              >
                Go to Dashboard
              </Link>
            </div>
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mt-6 p-3 border border-gray-300 rounded bg-gray-50">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary; 