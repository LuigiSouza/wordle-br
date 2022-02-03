import React, { useEffect, useState } from "react";
import { useLettersData } from "../../hooks/LetterContext";

import Card from "../Card";

import styles from "./styles.module.css";

function Grid({ word, flip = false, disabled = false, size = 5, status }) {
  return (
    <div className={styles.grid}>
      {[...Array(size).keys()].map((index) => (
        <Card
          delay={index}
          key={index}
          flip={flip}
          jump={word.length - 1 >= index}
          disabled={disabled}
          status={status[index]}
          underline={word.length === index && !disabled}
        >
          {word[index] || " "}
        </Card>
      ))}
    </div>
  );
}

export default Grid;
