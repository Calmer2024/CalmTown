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

function useAdaptiveMenuButtonColor() {
  const [buttonColor, setButtonColor] = useState("#ffffff");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const interests = document.getElementById("interests");
      if (!interests) return;

      const rect = interests.getBoundingClientRect();
      const sampleY = Math.max(28, Math.min(56, window.innerHeight * 0.08));
      const isOverInterests = rect.top <= sampleY && rect.bottom >= sampleY;
      setButtonColor(isOverInterests ? "#111111" : "#ffffff");
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return buttonColor;
}

export default function FloatingStaggeredMenu() {
  const menuButtonColor = useAdaptiveMenuButtonColor();

  return (
    <Suspense fallback={null}>
      <StaggeredMenu
        isFixed
        position="right"
        items={menuItems}
        socialItems={menuSocialItems}
        displaySocials
        displayItemNumbering
        menuButtonColor={menuButtonColor}
        openMenuButtonColor="#111111"
        changeMenuColorOnOpen
        colors={["#ffffff", "#b7b7b7", "#111111"]}
        accentColor="#111111"
      />
    </Suspense>
  );
}
