import { useEffect, useRef, useState } from "react";
import InfiniteMenu from "../components/InfiniteMenu";
import SectionHeading from "../components/SectionHeading";
import { friendMenuItems } from "../data/siteContent";

export default function FriendsMenuSection() {
  const sectionRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`friends-menu-section${hasEntered ? " is-entered" : ""}`}
      id="about"
      ref={sectionRef}
      aria-labelledby="friends-menu-title"
    >
      <SectionHeading
        className="friends-section-heading"
        id="friends-menu-title"
        number="00"
        title="Friend Says"
      />
      <div className="friends-menu-shell">
        <InfiniteMenu items={friendMenuItems} scale={1.06} />
      </div>
      <p className="friends-menu-tip">Tip: 鼠标拖动以切换留言</p>
    </section>
  );
}
