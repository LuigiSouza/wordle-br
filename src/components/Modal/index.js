import React, { useRef, useEffect } from "react";

import styles from "./styles.module.css";

function Modal({ show, hide, children }) {
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    const children = ref?.current?.children[0];
    if (children && !children.contains(event.target)) hide && hide();
  };

  useEffect(() => {
    if (show) ref.current.style.display = "block";
    else ref.current.style.display = "none";
  }, [show]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <div ref={ref} className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={hide}>
          &times;
        </span>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
