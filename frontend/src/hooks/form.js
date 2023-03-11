import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useForm(submitHandler) {
  const dispatch = useDispatch();

  const onSubmitButtonClick = useCallback(() => {
    submitHandler(dispatch);
  }, []);

  return {
    onClick: onSubmitButtonClick,
  };
}
