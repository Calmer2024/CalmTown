import { createElement } from "react";
import SectionHeader from "../components/SectionHeader";
import { interests } from "../data/siteContent";

export default function InterestsSection() {
  return (
    <section className="interests-section section-shell" id="interests">
      <SectionHeader title="Outside the editor">
        兴趣不是边角料，它们决定我怎样看节奏、光线、反馈和故事。
      </SectionHeader>

      <div className="interest-mosaic">
        {interests.map(({ title, text, icon, image }, index) => (
          <article
            className={`interest-tile interest-tile-${index + 1}`}
            data-reveal
            style={{ "--delay": `${index * 70}ms` }}
            key={title}
          >
            <img src={image} alt={`${title} mood`} loading="lazy" />
            <div className="interest-copy">
              {createElement(icon, { size: 22, weight: "duotone" })}
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
