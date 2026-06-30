import FadeIn from "../components/FadeIn";
import MagicBentoHover from "../components/MagicBentoHover";
import SectionHeading from "../components/SectionHeading";

export default function FooterSection() {
  return (
    <footer className="portfolio-section jack-footer" id="continued">
      <FadeIn>
        <SectionHeading className="jack-section-heading jack-footer-heading" id="continued-title" number="05" title="Thanks" />
      </FadeIn>

      <FadeIn delay={0.12} y={28}>
        <MagicBentoHover className="jack-footer-panel" glowColor="135, 190, 212" particleCount={8}>
          <img
            className="jack-footer-avatar"
            src="/calmer-q.png"
            alt="Calmer Q character"
            width="960"
            height="960"
            loading="lazy"
            decoding="async"
          />
          <p>THANK YOU FOR VISITING AND HAVE A GREAT DAY</p>
          <h2>TO BE CONTINUED</h2>
          <a className="jack-footer-link" href="#home">
            BACK TO TOP
          </a>
        </MagicBentoHover>
      </FadeIn>
    </footer>
  );
}
