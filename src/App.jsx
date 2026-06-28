import useRevealOnScroll from "./hooks/useRevealOnScroll";
import FloatingStaggeredMenu from "./components/FloatingStaggeredMenu";
import SiteNav from "./layout/SiteNav";
import BlogSection from "./sections/BlogSection";
import FriendsMenuSection from "./sections/FriendsMenuSection";
import Hero from "./sections/Hero";
import InterestsSection from "./sections/InterestsSection";
import WorksSection from "./sections/WorksSection";

export default function App() {
  useRevealOnScroll();

  return (
    <div className="app-shell">
      <SiteNav />
      <FloatingStaggeredMenu />
      <main>
        <Hero />
        <FriendsMenuSection />
        <WorksSection />
        <InterestsSection />
        <BlogSection />
      </main>
    </div>
  );
}
