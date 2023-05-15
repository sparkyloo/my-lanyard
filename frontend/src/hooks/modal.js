import { useCallback, useEffect, useRef, useState } from "react";

export function useModal(initialValue = false) {
  const [show, forceModalState] = useState(initialValue);
  const prevShow = useRef(show);

  const toggle = useCallback(() => {
    forceModalState(!show);
  }, [show]);

  useEffect(() => {
    if (show && prevShow.current === false) {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }

    if (show !== prevShow.current) {
      prevShow.current = show;
    }
  }, [show]);

  return {
    show,
    toggle,
    forceModalState,
    changed: prevShow.current !== show,
  };
}
