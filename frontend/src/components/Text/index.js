import { prepareStyles } from "../../css/classname";
import "./Text.css";

export function H1({ ...props }) {
  if (!props.fontSize) {
    props.fontSize = 9;
  }

  if (!props.fontWeight) {
    props.fontWeight = 4;
  }

  return <h1 {...prepareStyles(props)} />;
}

export function H2({ ...props }) {
  if (!props.fontSize) {
    props.fontSize = 8;
  }

  if (!props.fontWeight) {
    props.fontWeight = 3;
  }

  return <h2 {...prepareStyles(props)} />;
}

export function H3({ ...props }) {
  if (!props.fontSize) {
    props.fontSize = 4;
  }

  return <h3 {...prepareStyles(props)} />;
}

export function P({ ...props }) {
  return <p {...prepareStyles(props)} />;
}

export function Span({ ...props }) {
  return <span {...prepareStyles(props)} />;
}

export function Label({ ...props }) {
  if (!props.fontSize) {
    props.fontSize = 3;
  }

  if (!props.fontWeight) {
    props.fontWeight = 1;
  }

  return <label {...prepareStyles(props)} />;
}
