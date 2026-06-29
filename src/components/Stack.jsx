import { motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import "./Stack.css";

const MotionDiv = motion.div;

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <MotionDiv className="rb-stack-card-rotate-disabled" style={{ x: 0, y: 0 }}>
        {children}
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      className="rb-stack-card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </MotionDiv>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
}) {
  const reduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [stack, setStack] = useState(() => cards.map((content, index) => ({ id: index + 1, content })));

  useEffect(() => {
    setStack(cards.map((content, index) => ({ id: index + 1, content })));
  }, [cards]);

  const rotations = useMemo(
    () => stack.reduce((acc, card) => ({ ...acc, [card.id]: ((card.id * 17) % 10) - 5 }), {}),
    [stack],
  );

  const sendToBack = (id) => {
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (!autoplay || reduceMotion || stack.length <= 1 || isPaused) {
      return undefined;
    }

    const interval = setInterval(() => {
      const topCardId = stack[stack.length - 1].id;
      sendToBack(topCardId);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isPaused, reduceMotion, stack]);

  return (
    <div
      className="rb-stack-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = randomRotation ? rotations[card.id] : 0;
        const zIndex = index + 1;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={reduceMotion}
          >
            <MotionDiv
              className="rb-stack-card"
              style={{ zIndex }}
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={
                reduceMotion
                  ? { rotateZ: 0, scale: 1 }
                  : {
                      rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                      scale: 1 + index * 0.06 - stack.length * 0.06,
                      transformOrigin: "90% 90%",
                    }
              }
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </MotionDiv>
          </CardRotate>
        );
      })}
    </div>
  );
}
