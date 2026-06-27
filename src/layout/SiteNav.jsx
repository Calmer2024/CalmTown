import { Moon, Sun } from "@phosphor-icons/react";
import { navItems } from "../data/siteContent";

function updateScanPosition(event) {
  const { left, top } = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--scan-x", `${event.clientX - left}px`);
  event.currentTarget.style.setProperty("--scan-y", `${event.clientY - top}px`);
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Icon size={18} weight="bold" />
    </button>
  );
}

export default function SiteNav({ theme, onThemeToggle }) {
  return (
    <header className="site-nav">
      <a className="brand-mark" href="#home" aria-label="CALM TOWN home">
        <span>CT</span>
        <strong>CALM TOWN</strong>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            data-text={item.label}
            onPointerMove={updateScanPosition}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
    </header>
  );
}
