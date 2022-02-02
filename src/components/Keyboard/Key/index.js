import { useCallback, useState } from "react";

import styles from "./styles.module.css";

function Key({ action, children, status }) {
  const [clicked, setClicked] = useState(0);
  const [timeout, setTimeout] = useState(null);

  const handleClick = useCallback(() => {
    setClicked(1);
    var timeout = setInterval(() => {
      setClicked(2);
      clearTimeout(timeout);
    }, 1000);
    setTimeout(timeout);
  }, []);

  const handleSumbit = useCallback(() => {
    if (clicked === 2) {
      setClicked(0);
      return;
    }

    action();
    clearInterval(timeout);
    setTimeout(null);
    setClicked(0);
  }, [clicked, timeout, action]);

  return (
    <div
      className={`
        ${styles[status]} 
        ${styles.key} 
        ${clicked === 1 ? styles.clicked : ""}
      `}
      onTouchStart={handleClick}
      onClick={handleSumbit}
    >
      {typeof children === "string" ? children.toUpperCase() : children}
    </div>
  );
}

export default Key;
