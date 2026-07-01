import BrandIcon from "../components/BrandIcon";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";
import SpotlightCard from "../components/SpotlightCard";
import { techStackItems } from "../data/siteContent";

function toRgba(color, alpha = 0.24) {
  const hex = color.replace("#", "").trim();

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split("").map((char) => parseInt(`${char}${char}`, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

function TechStackCard({ item, index }) {
  const color = item.color ?? `#${item.icon.hex}`;
  const cardStyle = {
    "--stack-color": color,
    "--stack-glow": item.glow ?? color,
    "--stack-delay": `${index * 55}ms`,
  };

  return (
    <li className="tech-stack-card" style={cardStyle}>
      <SpotlightCard
        className="tech-stack-spotlight-card"
        spotlightColor={toRgba(item.glow ?? color, 0.28)}
      >
        <span className="tech-stack-card-icon" aria-hidden="true">
          <BrandIcon icon={item.icon} />
        </span>
        <span className="tech-stack-card-label">{item.label}</span>
      </SpotlightCard>
    </li>
  );
}

export default function TechStackSection() {
  return (
    <section className="portfolio-section tech-stack-section" id="tech-stack" aria-labelledby="tech-stack-title">
      <FadeIn>
        <SectionHeading
          className="jack-section-heading tech-stack-heading"
          id="tech-stack-title"
          number="01"
          title="Tech Stack"
        />
      </FadeIn>

      <div className="tech-stack-shell">
        <FadeIn className="tech-stack-board" delay={0.08} x={-28} y={18}>
          <ul className="tech-stack-grid" aria-label="Calmer technology stack">
            {techStackItems.map((item, index) => (
              <TechStackCard item={item} index={index} key={item.label} />
            ))}
          </ul>
        </FadeIn>

        <FadeIn className="tech-stack-character-wrap" delay={0.14} x={28} y={18}>
          <img
            className="tech-stack-character"
            src={`${import.meta.env.BASE_URL}calmer-stand.png`}
            alt="Calmer standing character"
            width="1024"
            height="1536"
            loading="lazy"
            decoding="async"
          />
        </FadeIn>
      </div>
    </section>
  );
}
