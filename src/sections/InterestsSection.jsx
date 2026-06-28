import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";
import { interests } from "../data/siteContent";

export default function InterestsSection() {
  return (
    <section className="portfolio-section jack-services" id="interests">
      <FadeIn>
        <SectionHeading className="jack-section-heading" id="interests-title" number="02" title="Interests" />
      </FadeIn>
      <div className="jack-service-list">
        {interests.map((interest, index) => (
          <FadeIn className="jack-service-item" delay={index * 0.1} y={26} key={interest.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{interest.title}</h3>
              <p>{interest.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
