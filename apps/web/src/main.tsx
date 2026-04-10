import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/boot.js";
import "./i18n/init.js";
import { App } from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Missing #root element");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
