import "./Modal.css";
import { FlexCol } from "../FlexCol";
import { prepareStyles } from "../../css/classname";
import { useCallback, useEffect, useRef } from "react";

export function Modal({ show, toggle, children }) {
  const backdropRef = useRef();

  const clickHandler = useCallback(
    (event) => {
      if (event.target === backdropRef.current) {
        toggle();
      }
    },
    [toggle]
  );

  useEffect(() => {
    let scrollHandler;

    if (show) {
      document.body.style.overflow = "hidden";
      scrollHandler = (event) => {
        if (event.target === document) {
          event.preventDefault();
        }
      };
    } else {
      document.body.style.overflow = "auto";
      scrollHandler = () => {};
    }

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [show]);

  return (
    <div
      ref={backdropRef}
      {...prepareStyles(
        {
          display: show ? "flex" : "hidden",
        },
        "ModalBackdrop"
      )}
      onClick={clickHandler}
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
