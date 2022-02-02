import styles from "./styles.module.css";

const cssStatusMap = {
  none: "",
  correct: "var(--correct-answer)",
  wrong: "var(--wrong-answer)",
  close: "var(--close-answer)",
};

function Card({
  status = "none",
  delay = 0,
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
        animationDelay: flip && `calc(${delay} * var(--flip-delay))`,
        transitionDelay:
          flip &&
          `calc(var(--flip-duration) / 2 + ${delay} * var(--flip-delay)`,
        backgroundColor: cssStatusMap[status],
      }}
    >
      {children.toUpperCase()}
    </div>
  );
}

export default Card;
