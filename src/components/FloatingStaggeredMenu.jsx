import { lazy, Suspense } from "react";
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
