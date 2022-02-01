import React from "react";

import styles from "./styles.module.css";

function Key({ children }) {
  return <div className={styles.key}>{children.toUpperCase()}</div>;
}

export default Key;
