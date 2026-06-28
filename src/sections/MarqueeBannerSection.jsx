import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const MotionDiv = motion.div;

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

export default function MarqueeBannerSection() {
  return (
    <section className="jack-marquee" aria-label="3D creator work previews">
      <MarqueeRow images={marqueeImages.slice(0, 11)} direction={1} />
      <MarqueeRow images={marqueeImages.slice(11)} direction={-1} />
    </section>
  );
}
