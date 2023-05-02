import { prepareStyles } from "../../css/classname";
import { Label } from "../Text";
import "./Radio.css";

export function Radio({
  children,
  label = children,
  size = 2,
  accent = "blue",
  checked,
  onChange,
  disabled,
  labelProps = {},
  inputProps = {},
  ...props
}) {
  props.accent = accent;
  props.display = "flex";

  if (!props.gap && size > 0) {
    props.gap = 0.5;
  }

  inputProps.type = "radio";
  inputProps.checked = checked;
  inputProps.onChange = onChange;
  inputProps.disabled = disabled;
  inputProps.width = size;
  inputProps.height = size;

  if (size === 0) {
    inputProps.margin = 0;
  }

  if (!label) {
    return <input {...prepareStyles({ ...props, ...inputProps })} />;
  } else {
    return (
      <Label {...prepareStyles({ cursor: "pointer", ...props, ...labelProps })}>
        {label}
        <input {...prepareStyles(inputProps)} />
      </Label>
    );
  }
}
