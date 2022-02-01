import React, { useEffect, useState } from "react";

import Card from "../Card";

import styles from "./styles.module.css";

function Grid({
  correctAnswer,
  word,
  flip = false,
  disabled = false,
  size = 5,
}) {
  const [status, setStatus] = useState([
    "none",
    "none",
    "none",
    "none",
    "none",
  ]);

  useEffect(() => {
    const updateStatus = () => {
      const answerMap = {};
      const newStatus = ["", "", "", "", ""];
      const uppersAnswer = correctAnswer.toUpperCase();
      for (let i = 0; i < size; i++) {
        if (uppersAnswer[i] === word[i]) newStatus[i] = "correct";
        else if (!answerMap[uppersAnswer[i]]) answerMap[uppersAnswer[i]] = 1;
        else answerMap[uppersAnswer[i]] += 1;
      }
      for (let i = 0; i < size; i++) {
        const letter = word[i];
        if (newStatus[i] !== "") continue;
        if (!answerMap[letter]) newStatus[i] = "wrong";
        else if (answerMap[letter] > 0) {
          newStatus[i] = "close";
          answerMap[letter]--;
        }
      }

      setStatus(newStatus);
    };

    if (flip) updateStatus();
  }, [flip, word, correctAnswer, size]);

  return (
    <div className={styles.grid}>
      {[...Array(size).keys()].map((index) => (
        <Card
          delay={index * 0.3}
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
