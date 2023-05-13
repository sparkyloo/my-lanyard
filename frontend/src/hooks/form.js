import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export function useForm(submitHandler) {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);

  const onSubmitButtonClick = useCallback(async () => {
    try {
      setIsPending(true);
      await submitHandler(dispatch);
    } finally {
      setIsPending(false);
    }
  }, [submitHandler, dispatch]);

  return {
    isPending,
    submitButton: {
      onClick: onSubmitButtonClick,
    },
  };
}
