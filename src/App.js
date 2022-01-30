import "./App.css";

import Grid from "./components/Grid";
import Board from "./components/Board";
import { useCallback, useEffect, useState } from "react";

const size = 5;
const tries = 6;

function App() {
  const [wordCount, setWordCount] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState("AMENO");

  const [animate, setAnimate] = useState(() => {
    return [...Array(tries).keys()].map(() => false);
  });
  const [submitWords, setSubmitWords] = useState(() => {
    return [...Array(tries).keys()].map(() => "");
  });

  const handleKeyPress = useCallback(
    (e) => {
      const letter = e.keyCode;
      if (letter >= 65 && letter <= 90) {
        if (submitWords[wordCount].length >= size) return;
        const newSubmit = [...submitWords];
        const newWord = newSubmit[wordCount];
        newSubmit[wordCount] = newWord + String.fromCharCode(letter);
        setSubmitWords(newSubmit);
      }
      if (letter === 13) {
        if (wordCount >= tries || submitWords[wordCount].length < size) return;
        const newAnimate = [...animate];
        newAnimate[wordCount] = true;
        setWordCount(wordCount + 1);
        setAnimate(newAnimate);
      }
      if (letter === 8) {
        if (submitWords[wordCount].length <= 0) return;
        const newSubmit = [...submitWords];
        const newWord = newSubmit[wordCount];
        newSubmit[wordCount] = newWord.substring(0, newWord.length - 1);
        setSubmitWords(newSubmit);
      }
    },
    [submitWords, wordCount, animate]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="App">
      <header>
        <span>(NOT) TERMO</span>
      </header>
      <div className="main-game">
        <Board>
          {[...Array(tries).keys()].map((index) => (
            <Grid
              key={index}
              correctAnswer={correctAnswer}
              word={submitWords[index]}
              size={size}
              animate={animate[index]}
            />
          ))}
        </Board>
      </div>
    </div>
  );
}

export default App;
