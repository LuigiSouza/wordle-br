import styles from "./styles.module.css";

function Board({ children }) {
  return <div className={styles.board}>{children}</div>;
}

export default Board;
