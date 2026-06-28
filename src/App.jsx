import useRevealOnScroll from "./hooks/useRevealOnScroll";
import FloatingStaggeredMenu from "./components/FloatingStaggeredMenu";
import SiteNav from "./layout/SiteNav";
import FriendsMenuSection from "./sections/FriendsMenuSection";
import Hero from "./sections/Hero";
import JackPortfolioSections from "./sections/JackPortfolioSections";

export default function App() {
  useRevealOnScroll();

  return (
    <div className="app-shell">
      <SiteNav />
      <FloatingStaggeredMenu />
      <main>
        <Hero />
        <FriendsMenuSection />
        <JackPortfolioSections />
      </main>
    </div>
  );
}
