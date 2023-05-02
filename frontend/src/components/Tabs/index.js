import { useCallback } from "react";
import { prepareStyles } from "../../css/classname";
import { Radio } from "../Radio";
import "./Tabs.css";

export function Tabs({ selected, options = [], onChange, ...props }) {
  props.display = "flex";

  const changeHandler = useCallback((event) => {
    onChange(event.target.value);
  }, []);

  return (
    <fieldset {...prepareStyles(props)}>
      {options.map(({ label, value }, i) => (
        <Radio
          key={i}
          size={0}
          fontSize={5}
          fontWeight={2}
          minWidth={10}
          align="center"
          justify="center"
          position="relative"
          inputProps={{ name: "tabs", value }}
          onChange={changeHandler}
        >
          {label}
          <div
            {...prepareStyles({
              position: "absolute",
              bg: value === selected ? "blue" : "transparent",
              width: "full",
              height: "2px",
              bottom: 0,
            })}
          />
        </Radio>
      ))}
    </fieldset>
  );
}
