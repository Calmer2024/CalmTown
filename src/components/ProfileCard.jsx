import { memo, useCallback, useEffect, useMemo, useRef } from "react";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(150deg, rgb(46 58 104 / 0.82) 0%, rgb(30 71 108 / 0.74) 48%, rgb(235 145 92 / 0.34) 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  ENTER_TRANSITION_MS: 180,
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

function ProfileCardComponent({
  avatarUrl,
  miniAvatarUrl,
  name = "Calmer",
  title = "AI Agent Engineer",
  handle = "Calmer2024",
  status = "随机选择摆烂",
  contactText = "Contact Me",
  note,
  showContact = true,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor = "rgb(255 214 150 / 0.38)",
  behindGlowSize = "62%",
  className = "",
  enableTilt = true,
  onContactClick,
}) {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) {
      return null;
    }

    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let initialUntil = 0;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;

      if (!shell || !wrap) {
        return;
      }

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1,
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 3.8))}deg`,
        "--rotate-y": `${round(centerY / 3.4)}deg`,
        "--content-x": `${round((percentX - 50) / 5.5)}px`,
        "--content-y": `${round((percentY - 50) / 6)}px`,
        "--avatar-x": `${round((percentX - 50) / 7)}px`,
        "--avatar-y": `${round((percentY - 50) / 8)}px`,
      };

      Object.entries(properties).forEach(([key, value]) => {
        wrap.style.setProperty(key, value);
      });
    };

    const step = (timestamp) => {
      if (!running) {
        return;
      }

      if (lastTs === 0) {
        lastTs = timestamp;
      }

      const delta = (timestamp - lastTs) / 1000;
      lastTs = timestamp;
      const tau = timestamp < initialUntil ? 0.6 : 0.14;
      const factor = 1 - Math.exp(-delta / tau);

      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      setVarsFromXY(currentX, currentY);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) {
        return;
      }

      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x;
        currentY = y;
        targetX = x;
        targetY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (shell) {
          this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
        }
      },
      settleCenter() {
        const shell = shellRef.current;
        if (!shell) {
          return;
        }

        this.setImmediate(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (event, element) => {
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) {
        return;
      }
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) {
        return;
      }

      shell.classList.add("active", "entering");
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) {
      return;
    }

    tiltEngine.toCenter();
    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        tiltEngine.settleCenter();
        shell.classList.remove("active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };

    if (leaveRafRef.current) {
      cancelAnimationFrame(leaveRafRef.current);
    }
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) {
      return undefined;
    }

    const shell = shellRef.current;
    if (!shell) {
      return undefined;
    }

    shell.addEventListener("pointerenter", handlePointerEnter);
    shell.addEventListener("pointermove", handlePointerMove);
    shell.addEventListener("pointerleave", handlePointerLeave);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    tiltEngine.setImmediate(initialX, ANIMATION_CONFIG.INITIAL_Y_OFFSET);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", handlePointerEnter);
      shell.removeEventListener("pointermove", handlePointerMove);
      shell.removeEventListener("pointerleave", handlePointerLeave);
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }
      if (leaveRafRef.current) {
        cancelAnimationFrame(leaveRafRef.current);
      }
      tiltEngine.cancel();
      shell.classList.remove("entering");
    };
  }, [enableTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  const cardStyle = {
    "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
    "--behind-glow-color": behindGlowColor,
    "--behind-glow-size": behindGlowSize,
  };

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled ? <div className="pc-behind" /> : null}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card" aria-label={`${name} profile card`}>
          <div className="pc-inside">
            <div className="pc-shine" aria-hidden="true" />
            <div className="pc-glare" aria-hidden="true" />

            <div className="pc-portrait" aria-hidden="true">
              <img src={avatarUrl} alt="" loading="lazy" />
            </div>

            <div className="pc-content">
              <h2>{name}</h2>
              <p>{title}</p>

              {note ? <p className="pc-note">{note}</p> : null}
            </div>

            <div className="pc-user-info">
              <div className="pc-user-details">
                <div className="pc-mini-avatar">
                  <img src={miniAvatarUrl || avatarUrl} alt="" loading="lazy" />
                </div>
                <div className="pc-user-text">
                  <div className="pc-handle">@{handle}</div>
                  <div className="pc-status">{status}</div>
                </div>
              </div>
              {showContact && contactText ? (
                <button className="pc-contact-btn" onClick={onContactClick} type="button">
                  {contactText}
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const ProfileCard = memo(ProfileCardComponent);

export default ProfileCard;
