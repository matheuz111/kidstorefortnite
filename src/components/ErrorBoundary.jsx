// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(error) {
    return { err: error };
  }
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="container-app mt-8 text-red-300">
          <h2 className="text-2xl font-burbankBig">Se produjo un error</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm opacity-80">
            {String(this.state.err?.message || this.state.err)}
          </pre>
          <p className="mt-2 text-xs opacity-60">
            Revisa la consola del navegador para más detalles.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
