import { useCallback, useEffect, useRef } from "react";
import "./ElectricBorder.css";

export default function ElectricBorder({
  children,
  color = "#5227ff",
  speed = 1,
  chaos = 0.12,
  thickness = 2,
  borderRadius = 24,
  className = "",
  style,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const lastDrawTimeRef = useRef(0);
  const isVisibleRef = useRef(false);

  const random = useCallback((x) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback(
    (x, y) => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);

      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random],
  );

  const octavedNoise = useCallback(
    (x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time, seed, baseFlatness) => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i += 1) {
        let octaveAmplitude = amplitude;
        if (i === 0) {
          octaveAmplitude *= baseFlatness;
        }
        y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D],
  );

  const getCornerPoint = useCallback((centerX, centerY, radius, startAngle, arcLength, progress) => {
    const angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  }, []);

  const getRoundedRectPoint = useCallback(
    (t, left, top, width, height, radius) => {
      const straightWidth = width - 2 * radius;
      const straightHeight = height - 2 * radius;
      const cornerArc = (Math.PI * radius) / 2;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
      const distance = t * totalPerimeter;

      let accumulated = 0;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + radius + progress * straightWidth, y: top };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left + width, y: top + radius + progress * straightHeight };
      }
      accumulated += straightHeight;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + width - radius - progress * straightWidth, y: top + height };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left, y: top + height - radius - progress * straightHeight };
      }
      accumulated += straightHeight;

      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
    },
    [getCornerPoint],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = reduceMotion ? 0.025 : chaos;
    const frequency = 10;
    const baseFlatness = 0;
    const displacement = reduceMotion ? 18 : 60;
    const borderOffset = 60;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      return { width, height };
    };

    let { width, height } = updateSize();
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

    const startAnimation = () => {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(drawElectricBorder);
      }
    };

    const drawElectricBorder = (currentTime) => {
      animationRef.current = null;

      if (!isVisibleRef.current && !reduceMotion) {
        return;
      }

      if (!reduceMotion && currentTime - lastDrawTimeRef.current < 1000 / 30) {
        startAnimation();
        return;
      }

      lastDrawTimeRef.current = currentTime;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        const newSize = updateSize();
        width = newSize.width;
        height = newSize.height;
      }

      const deltaTime = lastFrameTimeRef.current ? (currentTime - lastFrameTimeRef.current) / 1000 : 0;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const maxRadius = Math.min(borderWidth, borderHeight) / 2;
      const radius = Math.min(borderRadius, maxRadius);
      const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();

      for (let i = 0; i <= sampleCount; i += 1) {
        const progress = i / sampleCount;
        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        const xNoise = octavedNoise(progress * 8, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 0, baseFlatness);
        const yNoise = octavedNoise(progress * 8, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 1, baseFlatness);
        const displacedX = point.x + xNoise * displacement;
        const displacedY = point.y + yNoise * displacement;

        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else {
          ctx.lineTo(displacedX, displacedY);
        }
      }

      ctx.closePath();
      ctx.stroke();

      if (!reduceMotion) {
        startAnimation();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
      startAnimation();
    });
    resizeObserver.observe(container);

    let visibilityObserver;
    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            lastFrameTimeRef.current = 0;
            startAnimation();
          }
        },
        { rootMargin: "220px 0px", threshold: 0.05 },
      );
      visibilityObserver.observe(container);
    } else {
      isVisibleRef.current = true;
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
    };
  }, [color, speed, chaos, thickness, borderRadius, octavedNoise, getRoundedRectPoint]);

  const vars = {
    "--electric-border-color": color,
    "--electric-border-thickness": `${thickness}px`,
    borderRadius,
  };

  return (
    <div ref={containerRef} className={`electric-border ${className}`.trim()} style={{ ...vars, ...style }}>
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
}
