export function prepareStyles(props, ...extraClassNames) {
  const {
    className,
    display,
    text,
    position,
    top,
    right,
    bottom,
    left,
    flex,
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
    margin,
    padding,
    border,
    outline,
    ...rest
  } = props;

  return {
    ...rest,
    className: convertToClassNameString([
      className,
      displayClasses(display, text),
      positionClasses(position, top, right, bottom, left),
      flexClasses(flex, reverse, align, justify, direction),
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

export function displayClasses(display, text) {
  const classes = [];

  if (display) {
    if (display === "flex") {
      display = "flexbox";
    }

    classes.push(display);
  }

  if (text) {
    classes.push(`text-${text}`);
  }

  return classes;
}

export function positionClasses(position, top, right, bottom, left) {
  const classes = [];

  if (position) {
    classes.push(position);
  }

  if (top) {
    classes.push(`top-${top}`);
  }

  if (right) {
    classes.push(`right-${right}`);
  }

  if (bottom) {
    classes.push(`bottom-${bottom}`);
  }

  if (left) {
    classes.push(`left-${left}`);
  }

  return classes;
}

export function flexClasses(flex, reverse, align, justify, direction = "row") {
  const classes = [];

  if (flex) {
    classes.push(`flex-${flex}`);
  }

  if (reverse) {
    classes.push(`${direction}-reverse`);
  } else {
    classes.push(direction);
  }

  if (align) {
    classes.push(`align-${align}`);
  }

  if (justify) {
    classes.push(`justify-${justify}`);
  }

  return classes;
}

export function gapClasses(gap, rowGap, colGap) {
  const classes = [];

  if (gap) {
    classes.push(`row-gap-${gap} column-gap-${gap}`);
  } else {
    if (rowGap) {
      classes.push(`row-gap-${rowGap}`);
    }

    if (colGap) {
      classes.push(`column-gap-${colGap}`);
    }
  }

  return classes;
}

export function fontClasses(fontSize, fontWeight) {
  const classes = [];

  if (fontSize) {
    classes.push(`font-size-${fontSize}`);
  }

  if (fontWeight) {
    classes.push(`font-weight-${fontWeight}`);
  }

  return classes;
}

export function fixedHeightClasses(height) {
  const classes = [];

  if (height !== undefined && height !== null) {
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

  if (width !== undefined && width !== null) {
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

  if (minHeight) {
    throwIfNotValidDimension(minHeight);
    classes.push(`min-height-${minHeight}`);
  }

  if (maxHeight) {
    throwIfNotValidDimension(maxHeight);
    classes.push(`max-height-${maxHeight}`);
  }

  return classes;
}

export function limitedWidthClasses(minWidth, maxWidth) {
  const classes = [];

  if (minWidth) {
    throwIfNotValidDimension(minWidth);
    classes.push(`min-width-${minWidth}`);
  }

  if (maxWidth) {
    throwIfNotValidDimension(maxWidth);
    classes.push(`max-width-${maxWidth}`);
  }

  return classes;
}

export function spacingClasses(margin, padding) {
  if (!!margin && typeof margin !== "object") {
    margin = {
      all: margin,
    };
  }

  if (!!padding && typeof padding !== "object") {
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

  if (all) {
    classes.push(`margin-${all}`);
  }

  if (x) {
    classes.push(`margin-x-${x}`);
  }

  if (y) {
    classes.push(`margin-y-${y}`);
  }

  if (top || right || bottom || left) {
    classes.push("specific-margin");
  }

  if (top) {
    classes.push(`margin-top-${top}`);
  }

  if (right) {
    classes.push(`margin-right-${right}`);
  }

  if (bottom) {
    classes.push(`margin-bottom-${bottom}`);
  }

  if (left) {
    classes.push(`margin-left-${left}`);
  }

  return classes;
}

export function paddingClasses({ all, x, y, top, right, bottom, left } = {}) {
  const classes = [];

  if (all) {
    classes.push(`padding-${all}`);
  }

  if (x) {
    classes.push(`padding-x-${x}`);
  }

  if (y) {
    classes.push(`padding-y-${y}`);
  }

  if (top || right || bottom || left) {
    classes.push("specific-padding");
  }

  if (top) {
    classes.push(`padding-top-${top}`);
  }

  if (right) {
    classes.push(`padding-right-${right}`);
  }

  if (bottom) {
    classes.push(`padding-bottom-${bottom}`);
  }

  if (left) {
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
  color = "dark",
} = {}) {
  const classes = [];

  if (all || top || right || bottom || left) {
    classes.push("bordered", `border-${color}`);
  }

  if (all) {
    if (all === true) {
      all = 1;
    }

    classes.push(`border-${all}`);
  }

  if (x) {
    if (x === true) {
      x = 1;
    }

    classes.push(`border-x-${x}`);
  }

  if (y) {
    if (y === true) {
      y = 1;
    }

    classes.push(`border-y-${y}`);
  }

  if (top || right || bottom || left) {
    classes.push("specific-border");
  }

  if (top) {
    if (top === true) {
      top = 1;
    }

    classes.push(`border-top-${top}`);
  }

  if (right) {
    if (right === true) {
      right = 1;
    }

    classes.push(`border-right-${right}`);
  }

  if (bottom) {
    if (bottom === true) {
      bottom = 1;
    }

    classes.push(`border-bottom-${bottom}`);
  }

  if (left) {
    if (left === true) {
      left = 1;
    }

    classes.push(`border-left-${left}`);
  }

  return classes;
}

export function outlineClasses(color) {
  const classes = [];

  if (color) {
    classes.push("outlined", `outline-${color}`);
  }
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
