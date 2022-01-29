import React from "react";

import styles from "./styles.module.css";

function Card({ children }) {
  return <div className={styles.card}>{children.toUpperCase()}</div>;
}

export default Card;
