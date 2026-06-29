import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Masonry.css";

const MASONRY_QUERIES = ["(min-width:1500px)", "(min-width:1000px)", "(min-width:600px)", "(min-width:400px)"];
const MASONRY_COLUMNS = [5, 4, 3, 2];

function getMediaValue(queries, values, defaultValue) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return defaultValue;
  }

  const index = queries.findIndex((query) => window.matchMedia(query).matches);
  return values[index] ?? defaultValue;
}

function useMedia(queries, values, defaultValue) {
  const get = useCallback(() => getMediaValue(queries, values, defaultValue), [defaultValue, queries, values]);
  const [value, setValue] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const handler = () => setValue(get());
    const mediaQueries = queries.map((query) => window.matchMedia(query));
    mediaQueries.forEach((query) => query.addEventListener("change", handler));
    return () => mediaQueries.forEach((query) => query.removeEventListener("change", handler));
  }, [get, queries]);

  return value;
}

function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

async function preloadImages(urls) {
  if (typeof Image === "undefined") {
    return;
  }

  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const image = new Image();
          image.src = src;
          image.onload = image.onerror = () => resolve();
        }),
    ),
  );
}

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className = "",
}) {
  const columns = useMedia(MASONRY_QUERIES, MASONRY_COLUMNS, 1);
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);
  const itemRefs = useRef(new Map());

  useEffect(() => {
    setImagesReady(false);
    preloadImages(items.map((item) => item.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) {
      return { items: [], height: 0 };
    }

    const gap = 0;
    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const positionedItems = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height ?? columnWidth * (child.aspectRatio ?? 1.33);
      const y = colHeights[col];

      colHeights[col] += height + gap;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    return {
      items: positionedItems,
      height: Math.max(...colHeights),
    };
  }, [columns, items, width]);

  const getInitialPosition = useCallback(
    (item) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) {
        return { x: item.x, y: item.y };
      }

      let direction = animateFrom;
      if (animateFrom === "random") {
        const directions = ["top", "bottom", "left", "right"];
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      switch (direction) {
        case "top":
          return { x: item.x, y: -200 };
        case "bottom":
          return { x: item.x, y: window.innerHeight + 200 };
        case "left":
          return { x: -200, y: item.y };
        case "right":
          return { x: window.innerWidth + 200, y: item.y };
        case "center":
          return {
            x: containerRect.width / 2 - item.w / 2,
            y: containerRect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef],
  );

  useLayoutEffect(() => {
    if (!imagesReady) {
      return undefined;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animations = [];

    grid.items.forEach((item, index) => {
      const element = itemRefs.current.get(item.id);
      if (!element) {
        return;
      }

      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (reduceMotion) {
        gsap.set(element, { opacity: 1, filter: "none", ...animationProps });
        return;
      }

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        };

        animations.push(
          gsap.fromTo(element, initialState, {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          }),
        );
      } else {
        animations.push(
          gsap.to(element, {
            ...animationProps,
            duration,
            ease,
            overwrite: "auto",
          }),
        );
      }
    });

    hasMounted.current = true;

    return () => animations.forEach((animation) => animation.kill());
  }, [blurToFocus, duration, ease, getInitialPosition, grid, imagesReady, stagger]);

  const handleMouseEnter = (event) => {
    if (scaleOnHover) {
      gsap.to(event.currentTarget, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = event.currentTarget.querySelector(".rb-masonry-color-overlay");
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.28,
          duration: 0.3,
        });
      }
    }
  };

  const handleMouseLeave = (event) => {
    if (scaleOnHover) {
      gsap.to(event.currentTarget, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = event.currentTarget.querySelector(".rb-masonry-color-overlay");
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`rb-masonry-list ${className}`.trim()}
      style={{ height: grid.height || undefined }}
    >
      {grid.items.map((item) => (
        <button
          key={item.id}
          ref={(node) => {
            if (node) {
              itemRefs.current.set(item.id, node);
            } else {
              itemRefs.current.delete(item.id);
            }
          }}
          type="button"
          data-key={item.id}
          className="rb-masonry-item-wrapper"
          aria-label={item.title ?? `Open artwork ${item.id}`}
          onClick={() => item.url && window.open(item.url, "_blank", "noopener")}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="rb-masonry-item-img">
            <img src={item.img} alt={item.title ?? ""} loading="lazy" />
            {colorShiftOnHover && <span className="rb-masonry-color-overlay" aria-hidden="true" />}
          </span>
        </button>
      ))}
    </div>
  );
}
