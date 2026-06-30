import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

export default function FooterSection() {
  return (
    <footer className="portfolio-section jack-footer" id="continued">
      <FadeIn>
        <SectionHeading className="jack-section-heading jack-footer-heading" id="continued-title" number="05" title="Thanks" />
      </FadeIn>

      <FadeIn className="jack-footer-panel" delay={0.12} y={28}>
        <p>THANK YOU FOR VISITING AND HAVE A GREAT DAY</p>
        <h2>TO BE CONTINUED</h2>
        <a className="jack-footer-link" href="#home">
          BACK TO TOP
        </a>
      </FadeIn>
    </footer>
  );
}
