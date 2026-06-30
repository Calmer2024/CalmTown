import { ArrowUpRight } from "@phosphor-icons/react";
import BorderGlow from "../components/BorderGlow";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";
import { blogArticles } from "../data/blogContent";

export default function BlogSection() {
  return (
    <section className="portfolio-section jack-blog" id="blog">
      <FadeIn>
        <SectionHeading className="jack-section-heading" id="blog-title" number="04" title="Blog" />
      </FadeIn>
      <div className="jack-blog-list">
        {blogArticles.map((article, index) => (
          <FadeIn delay={0.12 + index * 0.08} y={24} key={article.slug}>
            <BorderGlow
              className="jack-blog-list-glow"
              edgeSensitivity={24}
              glowColor="198 52 72"
              backgroundColor="#050505"
              borderRadius={24}
              glowRadius={26}
              glowIntensity={0.74}
              coneSpread={18}
              fillOpacity={0.18}
              animated={index === 0}
              colors={["#87bed4", "#f2a565", "#f7f3e9"]}
            >
              <a className="jack-blog-row" href={`#blog/${article.slug}`}>
                <img src={article.cover} alt={`${article.title} article cover`} loading="lazy" />
                <div className="jack-blog-row-copy">
                  <p>
                    <span>{article.category}</span>
                    <span>{article.date}</span>
                  </p>
                  <h3>《{article.title}》</h3>
                  <small>{article.excerpt}</small>
                </div>
                <span className="jack-blog-row-number">{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight className="jack-blog-row-icon" size={22} weight="bold" aria-hidden="true" />
              </a>
            </BorderGlow>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
