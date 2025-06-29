import React from "react";
import App from "./app";
import "./index.css";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./ErrorBoundary";


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    document.getElementById('root')
  );
