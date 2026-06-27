import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { navItems } from "../data/siteContent";

function updateScanPosition(event) {
  const { left, top } = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--scan-x", `${event.clientX - left}px`);
  event.currentTarget.style.setProperty("--scan-y", `${event.clientY - top}px`);
}

function MenuButton({ isOpen, onToggle }) {
  const Icon = isOpen ? X : List;

  return (
    <button
      className="menu-button"
      type="button"
      aria-controls="site-menu"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      onClick={onToggle}
    >
      <Icon size={20} weight="bold" />
    </button>
  );
}

export default function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

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

      <div className={`menu-wrap${isMenuOpen ? " is-open" : ""}`} ref={menuRef}>
        <MenuButton
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((current) => !current)}
        />
        <nav
          className="site-menu"
          id="site-menu"
          aria-label="Menu navigation"
          aria-hidden={!isMenuOpen}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
