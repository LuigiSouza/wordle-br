import React from "react";

import styles from "./styles.module.css";

const cssStatusMap = {
  none: "",
  correct: styles.correct,
  wrong: styles.wrong,
  close: styles.close,
};

function Card({ delay = "0.5s", children, animate, status = "none" }) {
  return (
    <div
      className={`${styles.card} ${animate ? styles.animate : ""} ${
        cssStatusMap[status]
      }`}
      style={{
        animationDelay: `${parseFloat(delay)}s`,
        transitionDelay: `calc(var(--flip-duration) / 2 + ${parseFloat(
          delay
        )}s)`,
      }}
    >
      {children.toUpperCase()}
    </div>
  );
}

export default Card;
