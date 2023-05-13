import { useCallback, useState } from "react";

export function useCheckbox(initialValue) {
  const [checked, setChecked] = useState(initialValue);

  const onChange = useCallback((event) => {
    setChecked(event.target.checked);
  }, []);

  return [
    {
      checked,
      onChange,
    },
    setChecked,
  ];
}
