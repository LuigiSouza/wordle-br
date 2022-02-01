import React from "react";

import KeyPress from "./Key";

import styles from "./styles.module.css";

const fstRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const sndRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thdRow = ["z", "x", "c", "v", "b", "n", "m"];

function Keyboard() {
  return (
    <div className={styles.keyboard}>
      <div>
        {fstRow.map((key, index) => (
          <KeyPress key={index}>{key}</KeyPress>
        ))}
      </div>
      <div>
        {sndRow.map((key, index) => (
          <KeyPress key={index}>{key}</KeyPress>
        ))}
      </div>
      <div>
        {thdRow.map((key, index) => (
          <KeyPress key={index}>{key}</KeyPress>
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
