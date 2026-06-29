import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

export default function BlogSection() {
  return (
    <section className="portfolio-section jack-blog" id="blog">
      <FadeIn>
        <SectionHeading className="jack-section-heading" id="blog-title" number="04" title="Blog" />
      </FadeIn>
      <FadeIn className="jack-blog-card" delay={0.12} y={24}>
        <p>Latest writing</p>
        <h3>《乡土中国正在消失》</h3>
      </FadeIn>
    </section>
  );
}
