import React from "react";

import styles from "./styles.module.css";

const cssStatusMap = {
  none: "",
  correct: "var(--correct-answer)",
  wrong: "var(--wrong-answer)",
  close: "var(--close-answer)",
};

function Card({ delay = "0.5s", children, flip, jump, status = "none" }) {
  return (
    <div
      className={`${styles.card} ${flip ? styles.flip : ""} ${
        jump && !flip ? styles.jump : ""
      }`}
      style={{
        animationDelay: flip && `${parseFloat(delay)}s`,
        backgroundColor: cssStatusMap[status],
        transition: `background-color 0s calc(var(--flip-duration) / 2 + ${parseFloat(
          delay
        )}s)`,
      }}
    >
      {children.toUpperCase()}
    </div>
  );
}

export default Card;
