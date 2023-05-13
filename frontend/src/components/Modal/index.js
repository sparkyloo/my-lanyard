import "./Modal.css";
import { FlexCol } from "../FlexCol";
import { prepareStyles } from "../../css/classname";
import { useRef } from "react";

export function Modal({ show, toggle, children }) {
  const backdropRef = useRef();

  return (
    <div
      ref={backdropRef}
      {...prepareStyles(
        {
          display: show ? "flex" : "hidden",
        },
        "ModalBackdrop"
      )}
      onClick={(event) => {
        if (event.target === backdropRef.current) {
          toggle();
        }
      }}
    >
      <FlexCol
        rounded
        bg="white"
        padding={{
          y: 2,
          x: 4,
        }}
        className="ModalContent"
      >
        {children}
      </FlexCol>
    </div>
  );
}
