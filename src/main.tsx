import "@fontsource-variable/inter";
import "@fontsource-variable/montserrat";
import "./i18n/index";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider storageKey="renocost-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
