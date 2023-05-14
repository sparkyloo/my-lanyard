import "./Button.css";
import { NavLink } from "react-router-dom";
import { prepareStyles } from "../../css/classname";
import { useCallback } from "react";

export function Button({ variant, noMouseEvents, href, ...props }) {
  const config = {};

  switch (variant) {
    case "plain": {
      if (!noMouseEvents) {
        config.bg = "clear";
      }

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
    case "secondary": {
      config.bg = "clear";
      config.height = 4;
      config.rounded = true;
      config.padding = {
        x: 1,
      };
      config.border = {
        all: true,
        color: "light",
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

  if (href) {
    config.display = "flex";
    config.justify = "center";
    config.align = "center";
  }

  const { className, type, disabled, children, onClick } = prepareStyles(
    {
      ...config,
      ...props,
    },
    noMouseEvents ? "NoEffects" : ""
  );

  const clickHandler = useCallback(
    (event) => {
      if (!noMouseEvents) {
        event.stopPropagation();
        event.preventDefault();

        if (typeof onClick === "function") {
          onClick(event);
        }
      }
    },
    [noMouseEvents, onClick]
  );

  return !!href ? (
    <NavLink
      to={href}
      disabled={disabled || noMouseEvents}
      className={className}
    >
      {children}
    </NavLink>
  ) : (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
}
