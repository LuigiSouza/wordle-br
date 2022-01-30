import React from "react";

import styles from "./styles.module.css";

const cssStatusMap = {
  none: "",
  correct: "var(--correct-answer)",
  wrong: "var(--wrong-answer)",
  close: "var(--wrong-answer)",
};

function Card({ delay = "0.5s", children, animate, status = "none" }) {
  return (
    <div
      className={`${styles.card} ${animate ? styles.animate : ""}`}
      style={{
        animationDelay: `${parseFloat(delay)}s`,
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
