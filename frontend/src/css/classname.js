export function prepareStyles(props, ...extraClassNames) {
  let {
    className,
    scroll,
    bg,
    grow,
    shrink,
    accent,
    display,
    cursor,
    text,
    position,
    top,
    right,
    bottom,
    left,
    grid,
    flex,
    wrap,
    direction,
    reverse,
    align,
    justify,
    gap,
    rowGap,
    colGap,
    height,
    width,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
    fontSize,
    fontWeight,
    margin = {},
    padding = {},
    border = {},
    outline,
    round,
    rounded,
    invisible,
    ...rest
  } = props;

  if (margin === false) {
    margin = {};
  }

  if (padding === false) {
    padding = {};
  }

  if (border === false) {
    border = {};
  }

  if (round) {
    border.radius = "full";
  } else if (rounded) {
    border.radius = 1;
  }

  return {
    ...rest,
    className: convertToClassNameString([
      className,
      backgroundColorClasses(bg, accent),
      displayClasses(display, text, cursor, invisible, scroll),
      positionClasses(position, top, right, bottom, left),
      gridClasses(grid),
      flexClasses(flex, reverse, align, justify, grow, shrink, wrap, direction),
      gapClasses(gap, rowGap, colGap),
      fontClasses(fontSize, fontWeight),
      fixedHeightClasses(height),
      fixedWidthClasses(width),
      limitedHeightClasses(minHeight, maxHeight),
      limitedWidthClasses(minWidth, maxWidth),
      spacingClasses(margin, padding),
      borderClasses(border),
      outlineClasses(outline),
      extraClassNames,
    ]),
  };
}

export function backgroundColorClasses(bg, accent) {
  const classes = [];

  if (["white", "clear", "red", "green", "blue"].includes(bg)) {
    classes.push(`filled-${bg}`);
  }

  if (["white", "clear", "red", "green", "blue"].includes(accent)) {
    classes.push(`accented-${accent}`);
  }

  return classes;
}

export function displayClasses(display, text, cursor, invisible, scroll) {
  const classes = [];

  if (exists(display)) {
    if (display === "flex") {
      display = "flexbox";
    }

    classes.push(display);
  }

  if (exists(text)) {
    classes.push(`text-${text}`);
  }

  if (exists(cursor)) {
    classes.push(`cursor-${cursor}`);
  }

  if (invisible) {
    classes.push("invisible");
  }

  if (exists(scroll)) {
    if (scroll !== false) {
      if (scroll === true) {
        scroll = "all";
      }

      classes.push(`scroll-${scroll}`);
    }
  }

  return classes;
}

export function positionClasses(position, top, right, bottom, left) {
  const classes = [];

  if (exists(position)) {
    classes.push(position);
  }

  if (exists(top)) {
    classes.push(`top-${top}`);
  }

  if (exists(right)) {
    classes.push(`right-${right}`);
  }

  if (exists(bottom)) {
    classes.push(`bottom-${bottom}`);
  }

  if (exists(left)) {
    classes.push(`left-${left}`);
  }

  return classes;
}

export function gridClasses(grid) {
  const classes = [];

  if (exists(grid)) {
    classes.push(`grid-${grid}`);
  }

  return classes;
}

export function flexClasses(
  flex,
  reverse,
  align,
  justify,
  grow,
  shrink,
  wrap,
  direction = "row"
) {
  const classes = [];

  if (exists(flex)) {
    classes.push(`flex-${flex}`);
  }

  if (exists(grow)) {
    classes.push(`grow-${grow}`);
  }

  if (exists(shrink)) {
    classes.push(`shrink-${shrink}`);
  }

  if (reverse) {
    classes.push(`${direction}-reverse`);
  } else {
    classes.push(direction);
  }

  if (exists(align)) {
    classes.push(`align-${align}`);
  }

  if (exists(justify)) {
    classes.push(`justify-${justify}`);
  }

  if (exists(wrap)) {
    if (wrap === "reverse") {
      classes.push(`flex-wrap-reverse`);
    } else if (wrap === "no") {
      classes.push(`flex-nowrap`);
    } else {
      classes.push(`flex-wrap`);
    }
  }

  return classes;
}

export function gapClasses(gap, rowGap, colGap) {
  const classes = [];

  if (exists(gap)) {
    classes.push(`row-gap-${gap} column-gap-${gap}`);
  } else {
    if (exists(rowGap)) {
      classes.push(`row-gap-${rowGap}`);
    }

    if (exists(colGap)) {
      classes.push(`column-gap-${colGap}`);
    }
  }

  return classes;
}

export function fontClasses(fontSize, fontWeight) {
  const classes = [];

  if (exists(fontSize)) {
    classes.push(`font-size-${fontSize}`);
  }

  if (exists(fontWeight)) {
    classes.push(`font-weight-${fontWeight}`);
  }

  return classes;
}

export function fixedHeightClasses(height) {
  const classes = [];

  if (exists(height)) {
    if (height === false) {
      height = 0;
    }

    throwIfNotValidDimension(height);
    classes.push(`fixed-height-${height}`);
  }

  return classes;
}

export function fixedWidthClasses(width) {
  const classes = [];

  if (exists(width)) {
    if (width === false) {
      width = 0;
    }

    throwIfNotValidDimension(width);
    classes.push(`fixed-width-${width}`);
  }

  return classes;
}

export function limitedHeightClasses(minHeight, maxHeight) {
  const classes = [];

  if (exists(minHeight)) {
    throwIfNotValidDimension(minHeight);
    classes.push(`min-height-${minHeight}`);
  }

  if (exists(maxHeight)) {
    throwIfNotValidDimension(maxHeight);
    classes.push(`max-height-${maxHeight}`);
  }

  return classes;
}

export function limitedWidthClasses(minWidth, maxWidth) {
  const classes = [];

  if (exists(minWidth)) {
    throwIfNotValidDimension(minWidth);
    classes.push(`min-width-${minWidth}`);
  }

  if (exists(maxWidth)) {
    throwIfNotValidDimension(maxWidth);
    classes.push(`max-width-${maxWidth}`);
  }

  return classes;
}

export function spacingClasses(margin, padding) {
  if (exists(margin) && typeof margin !== "object") {
    margin = {
      all: margin,
    };
  }

  if (exists(padding) && typeof padding !== "object") {
    padding = {
      all: padding,
    };
  }

  if (margin || padding) {
    return [marginClasses(margin), paddingClasses(padding)];
  }
}

export function marginClasses({ all, x, y, top, right, bottom, left } = {}) {
  const classes = [];

  if (exists(all)) {
    classes.push(`margin-${all}`);
  }

  if (exists(x)) {
    classes.push(`margin-x-${x}`);
  }

  if (exists(y)) {
    classes.push(`margin-y-${y}`);
  }

  if (exists(top) || exists(right) || exists(bottom) || exists(left)) {
    classes.push("specific-margin");
  }

  if (exists(top)) {
    classes.push(`margin-top-${top}`);
  }

  if (exists(right)) {
    classes.push(`margin-right-${right}`);
  }

  if (exists(bottom)) {
    classes.push(`margin-bottom-${bottom}`);
  }

  if (exists(left)) {
    classes.push(`margin-left-${left}`);
  }

  return classes;
}

export function paddingClasses({ all, x, y, top, right, bottom, left } = {}) {
  const classes = [];

  if (exists(all)) {
    classes.push(`padding-${all}`);
  }

  if (exists(x)) {
    classes.push(`padding-x-${x}`);
  }

  if (exists(y)) {
    classes.push(`padding-y-${y}`);
  }

  if (exists(top) || exists(right) || exists(bottom) || exists(left)) {
    classes.push("specific-padding");
  }

  if (exists(top)) {
    classes.push(`padding-top-${top}`);
  }

  if (exists(right)) {
    classes.push(`padding-right-${right}`);
  }

  if (exists(bottom)) {
    classes.push(`padding-bottom-${bottom}`);
  }

  if (exists(left)) {
    classes.push(`padding-left-${left}`);
  }

  return classes;
}

export function borderClasses({
  all,
  x,
  y,
  top,
  right,
  bottom,
  left,
  radius,
  color = "dark",
} = {}) {
  const classes = [];

  if (exists(radius)) {
    classes.push(`border-radius-${radius}`);
  }

  if (
    exists(all) ||
    exists(top) ||
    exists(right) ||
    exists(bottom) ||
    exists(left)
  ) {
    classes.push("bordered", `border-${color}`);
  }

  if (exists(all)) {
    if (all === true) {
      all = 1;
    }

    classes.push(`border-${all}`);
  }

  if (exists(x)) {
    if (x === true) {
      x = 1;
    }

    classes.push(`border-x-${x}`);
  }

  if (exists(y)) {
    if (y === true) {
      y = 1;
    }

    classes.push(`border-y-${y}`);
  }

  if (exists(top) || exists(right) || exists(bottom) || exists(left)) {
    classes.push("specific-border");
  }

  if (exists(top)) {
    if (top === true) {
      top = 1;
    }

    classes.push(`border-top-${top}`);
  }

  if (exists(right)) {
    if (right === true) {
      right = 1;
    }

    classes.push(`border-right-${right}`);
  }

  if (exists(bottom)) {
    if (bottom === true) {
      bottom = 1;
    }

    classes.push(`border-bottom-${bottom}`);
  }

  if (exists(left)) {
    if (left === true) {
      left = 1;
    }

    classes.push(`border-left-${left}`);
  }

  return classes;
}

export function outlineClasses(color) {
  const classes = [];

  if (exists(color)) {
    classes.push("outlined", `outline-${color}`);
  }

  return classes;
}

function convertToClassNameString(...items) {
  return items
    .flat(Infinity)
    .filter((item) => typeof item === "string")
    .join(" ");
}

function throwIfNotValidDimension(n) {
  const allowed = [
    "1/4",
    "1/3",
    "1/2",
    "2/3",
    "3/4",
    "full",
    "0",
    "1px",
    "2px",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "40",
    "48",
    "56",
    "64",
    "72",
    "80",
    "88",
    "96",
  ];

  if (allowed.includes(`${n}`) === false) {
    throw new Error(
      `Invalid dimension: ${n} must be one of ${allowed.join(", ")}`
    );
  }
}

function exists(val) {
  return val !== undefined && val !== null;
}
