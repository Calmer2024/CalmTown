import { lazy, Suspense, useEffect, useState } from "react";
import { navItems, socialLinks } from "../data/siteContent";

const StaggeredMenu = lazy(() => import("./StaggeredMenu"));

const menuItems = navItems.map((item) => ({
  label: item.label,
  ariaLabel: `Go to ${item.label}`,
  link: item.href,
}));

const menuSocialItems = socialLinks.map((item) => ({
  label: item.label,
  link: item.href,
}));

export default function FloatingStaggeredMenu() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const aboutSection = document.getElementById("about");
    if (!aboutSection) return undefined;

    let frameId = 0;
    const updateVisibility = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setVisible(window.scrollY >= aboutSection.offsetTop - 12);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (!visible) return null;

  return (
    <Suspense fallback={null}>
    <StaggeredMenu
      isFixed
      position="right"
      items={menuItems}
      socialItems={menuSocialItems}
      displaySocials
      displayItemNumbering
      menuButtonColor="#ffffff"
      openMenuButtonColor="#111111"
      changeMenuColorOnOpen
      colors={["#ffffff", "#b7b7b7", "#111111"]}
      accentColor="#111111"
    />
    </Suspense>
  );
}
