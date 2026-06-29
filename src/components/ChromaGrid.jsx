import { BookmarkSimple, Heart } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export default function ChromaGrid({
  items = [],
  className = "",
  radius = 340,
  columns = 3,
  damping = 0.45,
  fadeOut = 0.5,
  ease = "power3.out",
}) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [actions, setActions] = useState({});

  useEffect(() => {
    const el = rootRef.current;
    const fadeElement = fadeRef.current;
    if (!el) {
      return undefined;
    }

    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");

    const rect = el.getBoundingClientRect();
    pos.current = { x: rect.width / 2, y: rect.height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);

    return () => {
      gsap.killTweensOf(pos.current);
      if (fadeElement) {
        gsap.killTweensOf(fadeElement);
      }
    };
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      overwrite: true,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
    });
  };

  const handleMove = (event) => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);

    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.2, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
    }
  };

  const handleCardMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const toggleAction = (event, cardId, type) => {
    event.stopPropagation();
    setActions((current) => {
      const cardActions = current[cardId] ?? {};
      const pulseKey = `${type}Pulse`;

      return {
        ...current,
        [cardId]: {
          ...cardActions,
          [type]: !cardActions[type],
          [pulseKey]: (cardActions[pulseKey] ?? 0) + 1,
        },
      };
    });
  };

  return (
    <div
      ref={rootRef}
      className={`rb-chroma-grid ${className}`}
      style={{ "--r": `${radius}px`, "--cols": columns }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((item) => {
        const cardId = item.id ?? item.title;
        const cardActions = actions[cardId] ?? {};

        return (
          <article
            className="rb-chroma-card"
            key={cardId}
            onMouseMove={handleCardMove}
            onClick={() => handleCardClick(item.url)}
            style={{
              "--card-border": item.borderColor ?? "#ffffff",
              "--card-gradient": item.gradient ?? "linear-gradient(145deg, #171717, #050505)",
              "--spotlight-color": item.spotlightColor ?? "rgb(255 255 255 / 0.22)",
              cursor: item.url ? "pointer" : "default",
            }}
          >
            <div className="rb-chroma-image-wrap">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <footer className="rb-chroma-info">
              <div className="rb-chroma-actions" aria-label={`${item.title} reactions`}>
                <button
                  type="button"
                  className={cardActions.like ? "is-active" : ""}
                  aria-label={`Like ${item.title}`}
                  aria-pressed={Boolean(cardActions.like)}
                  onClick={(event) => toggleAction(event, cardId, "like")}
                >
                  <Heart size={18} weight={cardActions.like ? "fill" : "regular"} />
                  {cardActions.likePulse > 0 && <span className="rb-chroma-pop" key={cardActions.likePulse} />}
                </button>
                <button
                  type="button"
                  className={cardActions.save ? "is-active" : ""}
                  aria-label={`Save ${item.title}`}
                  aria-pressed={Boolean(cardActions.save)}
                  onClick={(event) => toggleAction(event, cardId, "save")}
                >
                  <BookmarkSimple size={18} weight={cardActions.save ? "fill" : "regular"} />
                  {cardActions.savePulse > 0 && <span className="rb-chroma-pop" key={cardActions.savePulse} />}
                </button>
              </div>
              <div className="rb-chroma-text">
                <p>{item.subtitle}</p>
                <h3>{item.title}</h3>
              </div>
            </footer>
          </article>
        );
      })}
      <div className="rb-chroma-overlay" />
      <div ref={fadeRef} className="rb-chroma-fade" />
    </div>
  );
}
