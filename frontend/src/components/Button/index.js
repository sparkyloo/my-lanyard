import { prepareStyles } from "../../css/classname";
import "./Button.css";

export function Button({ ...props }) {
  if (!props.height) {
    props.height = 4;
  }

  return <button {...prepareStyles(props)} />;
}
