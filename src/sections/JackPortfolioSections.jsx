import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

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

const aboutDecor = [
  {
    className: "jack-decor jack-decor-moon",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
    alt: "3D moon icon",
    x: -80,
    delay: 0.1,
  },
  {
    className: "jack-decor jack-decor-shape",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
    alt: "3D abstract object",
    x: -80,
    delay: 0.25,
  },
  {
    className: "jack-decor jack-decor-lego",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
    alt: "3D lego icon",
    x: 80,
    delay: 0.15,
  },
  {
    className: "jack-decor jack-decor-group",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
    alt: "3D object group",
    x: 80,
    delay: 0.3,
  },
];

const services = [
  {
    name: "3D Modeling",
    description:
      "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    name: "Rendering",
    description:
      "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    name: "Motion Design",
    description:
      "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    name: "Branding",
    description:
      "Crafting cohesive visual identities, from logos to full brand systems, that communicate a clear and memorable presence.",
  },
  {
    name: "Web Design",
    description:
      "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
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
const MotionSpan = motion.span;

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

function AnimatedCharacter({ char, index, total, progress }) {
  const start = index / total;
  const end = start + 0.16;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="jack-char">
      <span className="jack-char-placeholder">{char}</span>
      <MotionSpan aria-hidden="true" style={{ opacity }}>
        {char}
      </MotionSpan>
    </span>
  );
}

function AnimatedText({ text }) {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.8", "end 0.2"],
  });
  const characters = Array.from(text);

  return (
    <p className="jack-animated-text" ref={target}>
      {characters.map((char, index) => (
        <AnimatedCharacter
          char={char}
          index={index}
          progress={scrollYProgress}
          total={characters.length}
          key={`${char}-${index}`}
        />
      ))}
    </p>
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

function AboutSection() {
  return (
    <section className="jack-about" id="about">
      {aboutDecor.map((item) => (
        <FadeIn className={item.className} delay={item.delay} duration={0.9} x={item.x} y={0} key={item.src}>
          <img src={item.src} alt={item.alt} loading="lazy" />
        </FadeIn>
      ))}
      <div className="jack-about-inner">
        <FadeIn y={40}>
          <h2 className="hero-heading jack-section-heading">About me</h2>
        </FadeIn>
        <AnimatedText text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" />
        <FadeIn delay={0.18} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="jack-services" id="services">
      <FadeIn>
        <h2 className="jack-section-heading">Services</h2>
      </FadeIn>
      <div className="jack-service-list">
        {services.map((service, index) => (
          <FadeIn className="jack-service-item" delay={index * 0.1} y={26} key={service.name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="jack-projects" id="projects">
      <FadeIn>
        <h2 className="hero-heading jack-section-heading">Project</h2>
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

export default function JackPortfolioSections() {
  const [themeSnapshot, setThemeSnapshot] = useState("light");

  useEffect(() => {
    setThemeSnapshot(document.documentElement.dataset.theme || "light");
  }, []);

  return (
    <div className="jack-portfolio" data-theme-snapshot={themeSnapshot}>
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <section className="jack-contact" id="contact">
        <h2 className="hero-heading">Let&apos;s make it cinematic.</h2>
        <ContactButton />
      </section>
    </div>
  );
}
