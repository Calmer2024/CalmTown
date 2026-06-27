import { useEffect, useMemo, useState } from "react";
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import SiteNav from "./layout/SiteNav";
import Hero from "./sections/Hero";
import JackPortfolioSections from "./sections/JackPortfolioSections";
import { getInitialTheme } from "./utils/theme";

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  useRevealOnScroll();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("calmtown-theme", theme);
  }, [theme]);

  const themeLabel = useMemo(() => (theme === "dark" ? "dark" : "light"), [theme]);

  return (
    <div className="app-shell" data-current-theme={themeLabel}>
      <SiteNav
        theme={theme}
        onThemeToggle={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
      />
      <main>
        <Hero />
        <JackPortfolioSections />
      </main>
    </div>
  );
}
