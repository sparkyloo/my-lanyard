import "./ErrorList.css";
import { useDispatch, useSelector } from "react-redux";
import { prepareStyles } from "../../css/classname";
import { useCallback } from "react";
import { FlexRow } from "../FlexRow";
import { Button } from "../Button";
import { P } from "../Text";

export function ErrorList({ ...props }) {
  const { className, errors, dismissError } = prepareStyles(props);

  const clickHandler = useCallback(
    (id) => {
      dismissError(id);
    },
    [dismissError]
  );

  return !errors || !errors.length ? null : (
    <div className={className}>
      {errors.map(({ id, content }) => (
        <ErrorItem key={id} id={id} onDismiss={clickHandler}>
          {content}
        </ErrorItem>
      ))}
    </div>
  );
}

function ErrorItem({ ...props }) {
  const { className, id, onDismiss, children } = prepareStyles(props);

  return (
    <div className={className}>
      <FlexRow gap={1} align="center" justify="between">
        <P flex={1}>{children}</P>
        <Button onClick={() => onDismiss(id)}>dismiss</Button>
      </FlexRow>
    </div>
  );
}
