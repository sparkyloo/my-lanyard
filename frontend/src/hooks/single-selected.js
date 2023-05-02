import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useSingleSelected(topic) {
  const dispatch = useDispatch();
  const selected = useSelector(topic.getSelected);

  const previousSelected = useRef(selected);

  useEffect(() => {
    if (selected.length > 1) {
      for (const id of previousSelected.current) {
        dispatch(topic.selections.forget(id));
      }
    }

    previousSelected.current = selected;
  }, [selected]);

  return selected;
}
