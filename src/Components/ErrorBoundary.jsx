import React from "react";

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(`${this.props.app} Error:`, error, errorInfo);
    this.props.handleError(this.props.app); // Disable the app on error
  }

  render() {
    if (this.state.hasError) {
      return <div>Sorry, the {this.props.app} is under maintenance.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
