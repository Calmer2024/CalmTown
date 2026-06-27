import SectionHeader from "../components/SectionHeader";
import { skillGroups } from "../data/siteContent";

export default function StackSection() {
  return (
    <section className="stack-section section-shell" id="stack">
      <SectionHeader title="A toolkit for calm experiments">
        技术栈不是标签墙，而是一组可以互相接线的工作台。
      </SectionHeader>

      <div className="skill-board">
        {skillGroups.map((group, index) => (
          <article
            className="skill-panel"
            data-reveal
            style={{ "--delay": `${index * 70}ms` }}
            key={group.title}
          >
            <div>
              <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
            </div>
            <div className="chip-cluster">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
