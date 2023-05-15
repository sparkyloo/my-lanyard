import { prepareStyles } from "../../css/classname";
import { Label } from "../Text";
import "./DropDown.css";

export function DropDown({ ...props }) {
  props.display = "flex";

  if (!props.direction) {
    props.direction = "column";
  }

  if (!props.gap) {
    props.gap = 0.5;
  }

  const {
    className,
    options = [],
    label,
    value,
    disabled,
    placeholder,
    type = "text",
    onChange,
    labelProps = {},
    inputProps = {},
    ...containerProps
  } = prepareStyles(props);

  if (containerProps.setValue) {
    delete containerProps.setValue;
  }

  if (!inputProps.border) {
    inputProps.rounded = true;

    inputProps.border = {
      all: 1,
      color: "light",
    };
  }

  if (!inputProps.padding) {
    inputProps.padding = {
      x: 0.5,
      y: 0.5,
    };
  }

  return (
    <div {...containerProps} className={className}>
      {label && <Label {...labelProps}>{label}</Label>}
      <select
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        {...prepareStyles(inputProps)}
      >
        {!!placeholder && <option value="">{placeholder}</option>}
        {options.map((item, i) => {
          if (Array.isArray(item)) {
            const [groupName, groupOptions] = item;
            return (
              <optgroup key={i} label={groupName}>
                {groupOptions.map(({ id, name }, j) => (
                  <option key={j} value={id}>
                    {name}
                  </option>
                ))}
              </optgroup>
            );
          } else {
            const { id, name } = item;

            return (
              <option key={i} value={id}>
                {name}
              </option>
            );
          }
        })}
      </select>
    </div>
  );
}
