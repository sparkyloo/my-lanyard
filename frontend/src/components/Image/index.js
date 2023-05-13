import "./Image.css";
import { prepareStyles } from "../../css/classname";

export function Image({ ...props }) {
  return <img {...prepareStyles(props)} />;
}
