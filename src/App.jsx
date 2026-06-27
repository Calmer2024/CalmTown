import useRevealOnScroll from "./hooks/useRevealOnScroll";
import SiteNav from "./layout/SiteNav";
import Hero from "./sections/Hero";
import JackPortfolioSections from "./sections/JackPortfolioSections";

export default function App() {
  useRevealOnScroll();

  return (
    <div className="app-shell">
      <SiteNav />
      <main>
        <Hero />
        <JackPortfolioSections />
      </main>
    </div>
  );
}
