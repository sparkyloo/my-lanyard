import "./FlexRow.css";
import { prepareStyles } from "../../css/classname";

export function FlexRow({ ...props }) {
  props.display = "flex";
  props.direction = "row";

  return <div {...prepareStyles(props)} />;
}
