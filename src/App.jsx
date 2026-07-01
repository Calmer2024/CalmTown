import { useEffect, useState } from "react";
import useMediaProtection from "./hooks/useMediaProtection";
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import FloatingStaggeredMenu from "./components/FloatingStaggeredMenu";
import SiteNav from "./layout/SiteNav";
import BlogArticlePage from "./sections/BlogArticlePage";
import BlogSection from "./sections/BlogSection";
import DesignSection from "./sections/DesignSection";
import FooterSection from "./sections/FooterSection";
import FriendsMenuSection from "./sections/FriendsMenuSection";
import Hero from "./sections/Hero";
import InterestsSection from "./sections/InterestsSection";
import TechStackSection from "./sections/TechStackSection";
import WorksSection from "./sections/WorksSection";

function getHashRoute() {
  if (typeof window === "undefined") return "";
  return window.location.hash.replace(/^#/, "");
}

export default function App() {
  useRevealOnScroll();
  useMediaProtection();
  const [route, setRoute] = useState(getHashRoute);
  const isBlogArticle = route.startsWith("blog/");
  const blogSlug = route.replace("blog/", "");

  useEffect(() => {
    const handleHashChange = () => setRoute(getHashRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (isBlogArticle) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    if (!route) return;
    window.requestAnimationFrame(() => {
      document.getElementById(route)?.scrollIntoView({ block: "start" });
    });
  }, [isBlogArticle, route]);

  return (
    <div className="app-shell">
      <SiteNav />
      {!isBlogArticle ? <FloatingStaggeredMenu /> : null}
      {isBlogArticle ? (
        <BlogArticlePage slug={blogSlug} />
      ) : (
        <main>
          <Hero />
          <FriendsMenuSection />
          <TechStackSection />
          <WorksSection />
          <DesignSection />
          <InterestsSection />
          <BlogSection />
          <FooterSection />
        </main>
      )}
    </div>
  );
}
