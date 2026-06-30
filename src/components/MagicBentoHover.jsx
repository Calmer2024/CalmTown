import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./MagicBentoHover.css";

const DEFAULT_GLOW_COLOR = "135, 190, 212";
const MOBILE_BREAKPOINT = 768;

function useDisabledAnimations(disableAnimations) {
  const [disabled, setDisabled] = useState(Boolean(disableAnimations));

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setDisabled(Boolean(disableAnimations) || reducedMotion.matches || window.innerWidth <= MOBILE_BREAKPOINT);
    };

    update();
    window.addEventListener("resize", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [disableAnimations]);

  return disabled;
}

function createParticleElement(x, y, color) {
  const particle = document.createElement("span");
  particle.className = "magic-bento-particle";
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.color = `rgb(${color})`;
  particle.style.background = `rgba(${color}, 1)`;
  particle.style.boxShadow = `0 0 12px rgba(${color}, 0.62)`;
  return particle;
}

export default function MagicBentoHover({
  children,
  className = "",
  glowColor = DEFAULT_GLOW_COLOR,
  particleCount = 12,
  spotlightRadius = 360,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  disableAnimations = false,
}) {
  const panelRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const magnetismTweenRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isDisabled = useDisabledAnimations(disableAnimations);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismTweenRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "back.in(1.6)",
        onComplete: () => particle.remove(),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const { width, height } = panel.getBoundingClientRect();
    Array.from({ length: particleCount }).forEach((_, index) => {
      const timeout = window.setTimeout(() => {
        if (!panelRef.current) return;

        const particle = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
        panelRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.7)" });
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          rotation: Math.random() * 360,
          duration: 1.8 + Math.random() * 1.4,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(particle, {
          opacity: 0.25,
          duration: 1.2,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 72);

      timeoutsRef.current.push(timeout);
    });
  }, [glowColor, particleCount]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || isDisabled) return undefined;

    const handleMouseEnter = () => {
      if (isHoveredRef.current) return;
      isHoveredRef.current = true;
      panel.style.setProperty("--magic-border-opacity", "1");
      animateParticles();
    };

    const handleMouseMove = (event) => {
      const rect = panel.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      panel.style.setProperty("--magic-x", `${(x / rect.width) * 100}%`);
      panel.style.setProperty("--magic-y", `${(y / rect.height) * 100}%`);

      if (!isHoveredRef.current) {
        isHoveredRef.current = true;
        panel.style.setProperty("--magic-border-opacity", "1");
        animateParticles();
      }

      if (enableTilt) {
        gsap.to(panel, {
          rotateX: ((y - centerY) / centerY) * -5,
          rotateY: ((x - centerX) / centerX) * 5,
          duration: 0.14,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        magnetismTweenRef.current = gsap.to(panel, {
          x: (x - centerX) * 0.035,
          y: (y - centerY) * 0.035,
          duration: 0.28,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      panel.style.setProperty("--magic-border-opacity", "0");
      clearParticles();
      gsap.to(panel, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleClick = (event) => {
      if (!clickEffect) return;

      const rect = panel.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("span");

      ripple.className = "magic-bento-ripple";
      ripple.style.left = `${x - maxDistance}px`;
      ripple.style.top = `${y - maxDistance}px`;
      ripple.style.width = `${maxDistance * 2}px`;
      ripple.style.height = `${maxDistance * 2}px`;
      ripple.style.background = `radial-gradient(circle, rgba(${glowColor}, 0.36) 0%, rgba(${glowColor}, 0.16) 32%, transparent 70%)`;
      panel.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.76,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    panel.addEventListener("mouseenter", handleMouseEnter);
    panel.addEventListener("mousemove", handleMouseMove);
    panel.addEventListener("mouseleave", handleMouseLeave);
    panel.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      panel.removeEventListener("mouseenter", handleMouseEnter);
      panel.removeEventListener("mousemove", handleMouseMove);
      panel.removeEventListener("mouseleave", handleMouseLeave);
      panel.removeEventListener("click", handleClick);
      clearParticles();
    };
  }, [animateParticles, clearParticles, clickEffect, enableMagnetism, enableTilt, glowColor, isDisabled]);

  return (
    <div
      ref={panelRef}
      className={`magic-bento-hover ${className}`.trim()}
      style={{
        "--magic-glow-color": glowColor,
        "--magic-spotlight-size": `${spotlightRadius}px`,
      }}
    >
      {children}
    </div>
  );
}
