import React, { useCallback, useState } from "react";

import styles from "./styles.module.css";

function Key({ action, children }) {
  const [clicked, setClicked] = useState(false);
  const [timeout, setTimeout] = useState(null);

  const handleClick = useCallback(() => {
    setClicked(true);
    var timeout = setInterval(() => {
      setClicked(false);
      clearTimeout(timeout);
    }, 1000);
    setTimeout(timeout);
  }, []);

  const handleSumbit = useCallback(() => {
    if (!clicked) return;

    action();
    clearInterval(timeout);
    setTimeout(null);
    setClicked(false);
  }, [clicked, timeout, action]);

  return (
    <div
      className={`${styles.key} ${clicked ? styles.clicked : ""}`}
      onTouchStart={handleClick}
      onTouchEnd={handleSumbit}
      onClick={action}
    >
      {typeof children === "string" ? children.toUpperCase() : children}
    </div>
  );
}

export default Key;
