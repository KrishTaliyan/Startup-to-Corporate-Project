import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";

// --- SAFETY NET COMPONENT ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", background: "#330000", color: "red", height: "100vh" }}>
          <h1>⚠️ SYSTEM CRASH</h1>
          <h2 style={{ color: "white" }}>{this.state.error?.toString()}</h2>
          <p style={{ color: "#ccc" }}>
            Please take a screenshot of this or copy the text above and send it to me.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- APP RENDER ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </ErrorBoundary>
);