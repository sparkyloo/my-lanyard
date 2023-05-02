import "./Button.css";
import { prepareStyles } from "../../css/classname";

export function Button({ variant, ...props }) {
  const config = {};

  switch (variant) {
    case "plain": {
      config.bg = "clear";

      break;
    }
    case "icon": {
      config.bg = "clear";
      config.round = true;
      config.border = {
        all: 0,
      };

      break;
    }
    default: {
      config.bg = "blue";
      config.height = 4;
      config.rounded = true;
      config.padding = {
        x: 1,
      };
      config.border = {
        all: 0,
      };

      break;
    }
  }

  const { className, type, disabled, children, onClick } = prepareStyles({
    ...config,
    ...props,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();

        if (typeof onClick === "function") {
          onClick(event);
        }
      }}
    >
      {children}
    </button>
  );
}
