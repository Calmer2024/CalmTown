import { createElement } from "react";
import SectionHeader from "../components/SectionHeader";
import { workCategories } from "../data/siteContent";

export default function WorksSection() {
  return (
    <section className="works-section section-shell" id="works">
      <SectionHeader kicker="Selected index" title="Works in four directions">
        开发、设计、AIGC 和写作先组成目录，之后每一项都可以替换成真实项目页。
      </SectionHeader>

      <div className="work-grid">
        {workCategories.map(({ title, deck, icon, image, items }, index) => (
          <article
            className={`work-card work-card-${index + 1}`}
            data-reveal
            style={{ "--delay": `${index * 80}ms` }}
            key={title}
          >
            <div className="work-image">
              <img src={image} alt={`${title} portfolio mood`} loading="lazy" />
            </div>
            <div className="work-body">
              <div className="work-title-row">
                {createElement(icon, { size: 24, weight: "duotone" })}
                <h3>{title}</h3>
              </div>
              <p>{deck}</p>
              <div className="work-items">
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
