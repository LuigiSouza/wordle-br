import React, { useEffect, useState } from "react";

import Card from "../Card";

import styles from "./styles.module.css";

function Grid({ correctAnswer, word, size = 5, animate = false }) {
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
      for (let i = 0; i < size; i++) {
        if (correctAnswer[i] === word[i]) newStatus[i] = "correct";
        else if (!answerMap[correctAnswer[i]]) answerMap[correctAnswer[i]] = 1;
        else answerMap[correctAnswer[i]] += 1;
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

    if (animate) updateStatus();
  }, [animate, word, correctAnswer, size]);

  return (
    <div className={styles.grid}>
      {[...Array(size).keys()].map((index) => (
        <Card
          delay={index * 0.3}
          key={index}
          animate={animate}
          status={status[index]}
        >
          {word[index] || " "}
        </Card>
      ))}
    </div>
  );
}

export default Grid;
