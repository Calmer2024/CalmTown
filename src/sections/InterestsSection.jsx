import FadeIn from "../components/FadeIn";
import InterestMusicPlayer from "../components/InterestMusicPlayer";
import SectionHeading from "../components/SectionHeading";
import { interests } from "../data/siteContent";

export default function InterestsSection() {
  return (
    <section className="portfolio-section jack-services" id="interests">
      <FadeIn>
        <SectionHeading className="jack-section-heading" id="interests-title" number="03" title="Interests" />
      </FadeIn>
      <div className="jack-service-list">
        {interests.map((interest, index) => (
          <FadeIn className="jack-service-item" delay={index * 0.1} y={26} key={interest.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div className="jack-service-content">
              <div className="jack-service-copy">
                <h3>{interest.title}</h3>
                <p>{interest.summary}</p>
              </div>
              <div className="interest-thumb-grid">
                {interest.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article className="interest-thumb-row" key={`${interest.title}-${item.title}`}>
                      {Icon ? (
                        <span className="interest-thumb-icon" aria-hidden="true">
                          <Icon size={28} weight="duotone" />
                        </span>
                      ) : (
                        <img src={item.image} alt={`${item.title} thumbnail`} loading="lazy" />
                      )}
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
              {interest.title === "Music" ? <InterestMusicPlayer /> : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
