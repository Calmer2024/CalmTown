import { Children, useEffect, useRef } from "react";

const FuzzyText = ({
  children,
  fontSize = "clamp(2rem, 10vw, 10rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  fps = 60,
  direction = "horizontal",
  transitionDuration = 0,
  clickEffect = false,
  glitchMode = false,
  glitchInterval = 2000,
  glitchDuration = 200,
  gradient = null,
  letterSpacing = 0,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let glitchTimeoutId;
    let glitchEndTimeoutId;
    let clickTimeoutId;
    let resizeTimeoutId;
    let isCancelled = false;
    let cleanupCanvas = () => {};
    let initVersion = 0;
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const init = async () => {
      const version = initVersion + 1;
      initVersion = version;
      cleanupCanvas();

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;

      let numericFontSize;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.position = "absolute";
        temp.style.visibility = "hidden";
        temp.style.pointerEvents = "none";
        temp.style.fontFamily = computedFontFamily;
        temp.style.fontSize = fontSize;
        temp.textContent = "M";
        (canvas.parentElement || document.body).appendChild(temp);
        numericFontSize = parseFloat(window.getComputedStyle(temp).fontSize) || 16;
        temp.remove();
      }

      const fontSizeStr = `${numericFontSize}px`;
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

      try {
        await document.fonts.load(fontString);
      } catch {
        await document.fonts.ready;
      }

      if (isCancelled || version !== initVersion) {
        return;
      }

      const text = Children.toArray(children).join("");
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");

      if (!offCtx) {
        return;
      }

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";

      let totalWidth = 0;
      if (letterSpacing !== 0) {
        for (const char of text) {
          totalWidth += offCtx.measureText(char).width + letterSpacing;
        }
        totalWidth -= letterSpacing;
      } else {
        totalWidth = offCtx.measureText(text).width;
      }

      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight =
        letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width);
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;
      const textBoundingWidth = Math.ceil(
        letterSpacing !== 0 ? totalWidth : actualLeft + actualRight,
      );
      const tightHeight = Math.ceil(actualAscent + actualDescent);
      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";

      if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
        const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);
        gradient.forEach((item, index) =>
          grad.addColorStop(index / (gradient.length - 1), item),
        );
        offCtx.fillStyle = grad;
      } else {
        offCtx.fillStyle = color;
      }

      if (letterSpacing !== 0) {
        let xPos = xOffset;
        for (const char of text) {
          offCtx.fillText(char, xPos, actualAscent);
          xPos += offCtx.measureText(char).width + letterSpacing;
        }
      } else {
        offCtx.fillText(text, xOffset - actualLeft, actualAscent);
      }

      const horizontalMargin = fuzzRange + 20;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      let isClicking = false;
      let isGlitching = false;
      let currentIntensity = baseIntensity;
      let targetIntensity = baseIntensity;
      let lastFrameTime = 0;
      const frameDuration = 1000 / fps;

      const startGlitchLoop = () => {
        if (!glitchMode || isCancelled) {
          return;
        }

        glitchTimeoutId = window.setTimeout(() => {
          if (isCancelled) {
            return;
          }

          isGlitching = true;
          glitchEndTimeoutId = window.setTimeout(() => {
            isGlitching = false;
            startGlitchLoop();
          }, glitchDuration);
        }, glitchInterval);
      };

      if (glitchMode) {
        startGlitchLoop();
      }

      const run = (timestamp) => {
        if (isCancelled || version !== initVersion) {
          return;
        }

        if (timestamp - lastFrameTime < frameDuration) {
          animationFrameId = window.requestAnimationFrame(run);
          return;
        }

        lastFrameTime = timestamp;
        ctx.clearRect(
          -fuzzRange - 20,
          -fuzzRange - 10,
          offscreenWidth + 2 * (fuzzRange + 20),
          tightHeight + 2 * (fuzzRange + 10),
        );

        if (isClicking || isGlitching) {
          targetIntensity = 1;
        } else if (isHovering) {
          targetIntensity = hoverIntensity;
        } else {
          targetIntensity = baseIntensity;
        }

        if (transitionDuration > 0) {
          const step = 1 / (transitionDuration / frameDuration);
          if (currentIntensity < targetIntensity) {
            currentIntensity = Math.min(currentIntensity + step, targetIntensity);
          } else if (currentIntensity > targetIntensity) {
            currentIntensity = Math.max(currentIntensity - step, targetIntensity);
          }
        } else {
          currentIntensity = targetIntensity;
        }

        if (direction === "horizontal") {
          for (let y = 0; y < tightHeight; y += 1) {
            const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
            ctx.drawImage(offscreen, 0, y, offscreenWidth, 1, dx, y, offscreenWidth, 1);
          }
        } else if (direction === "vertical") {
          for (let x = 0; x < offscreenWidth; x += 1) {
            const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
            ctx.drawImage(offscreen, x, 0, 1, tightHeight, x, dy, 1, tightHeight);
          }
        } else {
          for (let y = 0; y < tightHeight; y += 1) {
            const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
            ctx.drawImage(offscreen, 0, y, offscreenWidth, 1, dx, y, offscreenWidth, 1);
          }

          const tempData = ctx.getImageData(0, 0, offscreenWidth + fuzzRange, tightHeight + fuzzRange);
          ctx.clearRect(
            -fuzzRange - 20,
            -fuzzRange - 10,
            offscreenWidth + 2 * (fuzzRange + 20),
            tightHeight + 2 * (fuzzRange + 10),
          );
          ctx.putImageData(tempData, 0, 0);

          for (let x = 0; x < offscreenWidth + fuzzRange; x += 1) {
            const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5);
            const columnData = ctx.getImageData(x, 0, 1, tightHeight + fuzzRange);
            ctx.clearRect(x, -fuzzRange, 1, tightHeight + 2 * fuzzRange);
            ctx.putImageData(columnData, x, dy);
          }
        }

        animationFrameId = window.requestAnimationFrame(run);
      };

      const isInsideTextArea = (x, y) =>
        x >= interactiveLeft &&
        x <= interactiveRight &&
        y >= interactiveTop &&
        y <= interactiveBottom;

      const handleMouseMove = (event) => {
        if (!enableHover) {
          return;
        }

        const rect = canvas.getBoundingClientRect();
        isHovering = isInsideTextArea(event.clientX - rect.left, event.clientY - rect.top);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleClick = () => {
        if (!clickEffect) {
          return;
        }

        isClicking = true;
        window.clearTimeout(clickTimeoutId);
        clickTimeoutId = window.setTimeout(() => {
          isClicking = false;
        }, 150);
      };

      const handleTouchMove = (event) => {
        if (!enableHover) {
          return;
        }

        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        isHovering = isInsideTextArea(touch.clientX - rect.left, touch.clientY - rect.top);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd);
      }

      if (clickEffect) {
        canvas.addEventListener("click", handleClick);
      }

      animationFrameId = window.requestAnimationFrame(run);
      cleanupCanvas = () => {
        window.cancelAnimationFrame(animationFrameId);
        window.clearTimeout(glitchTimeoutId);
        window.clearTimeout(glitchEndTimeoutId);
        window.clearTimeout(clickTimeoutId);

        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }

        if (clickEffect) {
          canvas.removeEventListener("click", handleClick);
        }
      };
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimeoutId);
      resizeTimeoutId = window.setTimeout(() => {
        if (!isCancelled) {
          init();
        }
      }, 160);
    };

    init();
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      initVersion += 1;
      cleanupCanvas();
      window.clearTimeout(resizeTimeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    fuzzRange,
    fps,
    direction,
    transitionDuration,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
    gradient,
    letterSpacing,
  ]);

  return <canvas ref={canvasRef} className={className} />;
};

export default FuzzyText;
