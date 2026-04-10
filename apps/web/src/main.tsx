import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/boot.js";
import "./i18n/init.js";
import { App } from "./App.tsx";
import "./index.css";

function scheduleServiceWorkerRegister() {
  const run = () => {
    void import("virtual:pwa-register").then(({ registerSW }) => {
      registerSW({ immediate: true });
    });
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 0);
  }
}
scheduleServiceWorkerRegister();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Missing #root element");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
