import "./Grid.css";
import { prepareStyles } from "../../css/classname";

export function Grid({ col, ...props }) {
  props.display = "grid";
  props.grid = col;

  return <div {...prepareStyles(props)} />;
}
