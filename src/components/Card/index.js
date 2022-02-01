import React from "react";

import styles from "./styles.module.css";

const cssStatusMap = {
  none: "",
  correct: "var(--correct-answer)",
  wrong: "var(--wrong-answer)",
  close: "var(--close-answer)",
};

function Card({
  status = "none",
  delay = "0.5s",
  children,
  flip,
  jump,
  disabled,
  underline = true,
}) {
  return (
    <div
      className={`
        ${styles.card} ${flip ? styles.flip : ""} 
        ${jump && !flip ? styles.jump : ""} 
        ${disabled ? styles.disabled : ""} 
        ${underline ? styles.underline : ""}
      `}
      style={{
        animationDelay: flip && `${parseFloat(delay)}s`,
        transitionDelay:
          flip && `calc(var(--flip-duration) / 2 + ${parseFloat(delay)}s`,
        backgroundColor: cssStatusMap[status],
      }}
    >
      {children.toUpperCase()}
    </div>
  );
}

export default Card;
