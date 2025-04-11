import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Error view - without any router components
      return (
        <div className="error-page">
          <div className="error-container">
            <h1>Something went wrong</h1>
            <p>{this.state.error?.toString()}</p>
            <button onClick={() => window.location.href = '/'}>
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    // Normal rendering
    return this.props.children;
  }
}

export default ErrorBoundary;
