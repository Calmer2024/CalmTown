import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { interests } from "../data/siteContent";

const marqueeImages = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const projects = [
  {
    name: "Nextlevel Studio",
    category: "Client",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    ],
  },
  {
    name: "Aura Brand Identity",
    category: "Personal",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    ],
  },
  {
    name: "Solaris Digital",
    category: "Client",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    ],
  },
];

const MotionArticle = motion.article;
const MotionDiv = motion.div;

function FadeIn({ children, className = "", delay = 0, duration = 0.7, x = 0, y = 30 }) {
  const reduce = useReducedMotion();

  return (
    <MotionDiv
      className={className}
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionDiv>
  );
}

function ContactButton() {
  return (
    <a className="jack-contact-button" href="#contact">
      Contact Me
      <ArrowUpRight size={17} weight="bold" />
    </a>
  );
}

function MarqueeRow({ images, direction = 1 }) {
  const rowImages = [...images, ...images, ...images];
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [direction * -220, direction * 220]);
  const x = useSpring(rawX, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <div className="jack-marquee-viewport" ref={target}>
      <MotionDiv className="jack-marquee-row" style={{ x }}>
        {rowImages.map((src, index) => (
          <img src={src} alt="" loading="lazy" key={`${src}-${index}`} />
        ))}
      </MotionDiv>
    </div>
  );
}

function ProjectCard({ project, index, total }) {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0.14, 0.88], [1, targetScale]);

  return (
    <div className="jack-project-frame" ref={target}>
      <MotionArticle
        className="jack-project-card"
        style={{ scale, top: `calc(var(--project-top) + ${index * 28}px)` }}
      >
        <div className="jack-project-top">
          <span className="jack-project-number">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p>{project.category}</p>
            <h3>{project.name}</h3>
          </div>
          <a className="jack-live-button" href="#contact">
            Live Project
          </a>
        </div>
        <div className="jack-project-images">
          <div>
            <img src={project.images[0]} alt={`${project.name} preview one`} loading="lazy" />
            <img src={project.images[1]} alt={`${project.name} preview two`} loading="lazy" />
          </div>
          <img src={project.images[2]} alt={`${project.name} main preview`} loading="lazy" />
        </div>
      </MotionArticle>
    </div>
  );
}

function MarqueeSection() {
  return (
    <section className="jack-marquee" aria-label="3D creator work previews">
      <MarqueeRow images={marqueeImages.slice(0, 11)} direction={1} />
      <MarqueeRow images={marqueeImages.slice(11)} direction={-1} />
    </section>
  );
}

function InterestsSection() {
  return (
    <section className="jack-services" id="interests">
      <FadeIn>
        <h2 className="jack-section-heading">Interests</h2>
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

function ProjectsSection() {
  return (
    <section className="jack-projects" id="works">
      <FadeIn>
        <h2 className="hero-heading jack-section-heading">Works</h2>
      </FadeIn>
      <div className="jack-project-stack">
        {projects.map((project, index) => (
          <ProjectCard
            index={index}
            project={project}
            total={projects.length}
            key={project.name}
          />
        ))}
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section className="jack-blog" id="blog">
      <FadeIn>
        <h2 className="hero-heading jack-section-heading">Blog</h2>
      </FadeIn>
      <FadeIn className="jack-blog-card" delay={0.12} y={24}>
        <p>Latest writing</p>
        <h3>《乡土中国正在消失》</h3>
      </FadeIn>
    </section>
  );
}

export default function JackPortfolioSections() {
  return (
    <div className="jack-portfolio">
      <MarqueeSection />
      <ProjectsSection />
      <InterestsSection />
      <BlogSection />
      <section className="jack-contact" id="contact">
        <h2 className="hero-heading">Let&apos;s make it cinematic.</h2>
        <ContactButton />
      </section>
    </div>
  );
}
