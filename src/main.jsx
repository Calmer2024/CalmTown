import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/google-sans-flex/latin-400.css";
import "@fontsource/google-sans-flex/latin-500.css";
import "@fontsource/bebas-neue/latin-400.css";
import "@fontsource/dancing-script/latin-400.css";
import "@fontsource/dancing-script/latin-600.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/noto-serif-sc/chinese-simplified-400.css";
import "@fontsource/kanit/latin-300.css";
import "@fontsource/kanit/latin-400.css";
import "@fontsource/kanit/latin-500.css";
import "@fontsource/kanit/latin-700.css";
import "@fontsource/kanit/latin-900.css";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
