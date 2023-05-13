import "./FlexCol.css";
import { prepareStyles } from "../../css/classname";

export function FlexCol({ ...props }) {
  props.display = "flex";
  props.direction = "column";

  return <div {...prepareStyles(props)} />;
}
