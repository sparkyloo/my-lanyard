import { useCallback, useState } from "react";

export function useModal(initialValue = false) {
  const [show, forceModalState] = useState(initialValue);
  const toggle = useCallback(() => {
    forceModalState(!show);
  }, [show]);

  return {
    show,
    toggle,
    forceModalState,
  };
}
