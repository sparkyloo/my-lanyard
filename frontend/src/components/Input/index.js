import { prepareStyles } from "../../css/classname";
import { Label } from "../Text";
import "./Input.css";

export function Input({ ...props }) {
  props.display = "flex";

  if (!props.direction) {
    props.direction = "column";
  }

  if (!props.gap) {
    props.gap = 0.5;
  }

  const {
    className,
    label,
    value,
    placeholder,
    type = "text",
    onChange,
    labelProps = {},
    inputProps = {},
    ...containerProps
  } = prepareStyles(props);

  if (!inputProps.padding) {
    inputProps.padding = {
      x: 0.5,
      y: 0.25,
    };
  }

  return (
    <div {...containerProps} className={className}>
      {label && <Label {...labelProps}>{label}</Label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...prepareStyles(inputProps)}
      />
    </div>
  );
}
