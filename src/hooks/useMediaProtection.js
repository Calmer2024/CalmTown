import { useEffect } from "react";

const PROTECTED_MEDIA_SELECTOR = "img, canvas";

function isProtectedMediaTarget(target) {
  return target instanceof Element && target.closest(PROTECTED_MEDIA_SELECTOR);
}

export default function useMediaProtection() {
  useEffect(() => {
    const preventMediaAction = (event) => {
      if (isProtectedMediaTarget(event.target)) {
        event.preventDefault();
      }
    };

    const preventPageSave = (event) => {
      const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";
      if (isSaveShortcut) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventMediaAction, { capture: true });
    document.addEventListener("dragstart", preventMediaAction, { capture: true });
    document.addEventListener("selectstart", preventMediaAction, { capture: true });
    document.addEventListener("keydown", preventPageSave, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", preventMediaAction, { capture: true });
      document.removeEventListener("dragstart", preventMediaAction, { capture: true });
      document.removeEventListener("selectstart", preventMediaAction, { capture: true });
      document.removeEventListener("keydown", preventPageSave, { capture: true });
    };
  }, []);
}
