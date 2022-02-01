import { useCallback, useEffect, useReducer } from "react";

import Grid from "./components/Grid";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

import { mapAccent, answerList } from "./utils/words";
import { mulberry32, deNormalize } from "./utils/random";

import "./App.css";

const size = 5;
const tries = 6;

function reducer(state, action) {
  let words;
  switch (action.type) {
    case "write":
      if (state.words[state.count].length >= size) return state;
      words = [...state.words];
      words[state.count] += String.fromCharCode(action.letter);
      return { ...state, words };
    case "submit":
      if (state.count >= tries || state.words[state.count].length < size)
        return state;
      const flip = [...state.flip];
      flip[state.count] = true;
      return { ...state, flip, count: state.count + 1 };
    case "backspace":
      if (state.words[state.count].length <= 0) return state;
      words = [...state.words];
      words[state.count] = words[state.count].substring(
        0,
        words[state.count].length - 1
      );
      return { ...state, words };
    default:
      return state;
  }
}

function init() {
  function loadsAnswer() {
    const date = new Date();
    const seed =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString() +
      date.getDate().toString();
    const rand = mulberry32(seed);
    const value = deNormalize(rand(), 0, answerList.size);
    const word = [...answerList][value];
    return mapAccent[word] || word;
  }

  return {
    answer: loadsAnswer(),
    flip: [...Array(tries).keys()].map(() => false),
    words: [...Array(tries).keys()].map(() => ""),
    count: 0,
  };
}

function App() {
  const [state, dispatch] = useReducer(reducer, {}, init);

  const handleKeyPress = useCallback(
    (e) => {
      const letter = e.keyCode;
      if (letter >= 65 && letter <= 90) {
        dispatch({ type: "write", letter });
      }
      if (letter === 13) {
        dispatch({ type: "submit" });
      }
      if (letter === 8) {
        dispatch({ type: "backspace" });
      }
    },
    [dispatch]
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
              correctAnswer={state.answer}
              word={state.words[index]}
              size={size}
              flip={state.flip[index]}
            />
          ))}
        </Board>
        <Keyboard />
      </div>
    </div>
  );
}

export default App;
