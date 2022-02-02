import { useCallback, useEffect, useReducer } from "react";

import Grid from "./components/Grid";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

import { mapAccent, answerList, wordList } from "./utils/words";
import { mulberry32, deNormalize } from "./utils/random";

import "./App.css";

const size = 5;
const tries = 6;

function reducer(state, action) {
  const words = [...state.words];
  const current = state.words[state.count];
  switch (action.type) {
    case "write":
      if (state.gameState !== "waiting") return state;
      if (current.length >= size) return state;
      words[state.count] += String.fromCharCode(action.letter);
      return { ...state, words };
    case "submit":
      if (state.count >= tries || current.length < size) return state;
      const currentLower = current.toLowerCase();
      if (!wordList.has(currentLower)) return state;
      const flip = [...state.flip];
      flip[state.count] = true;
      const newWord = mapAccent[currentLower] || currentLower;
      words[state.count] = newWord.toUpperCase();
      return {
        ...state,
        count: state.count + 1,
        gameState: "animating",
        flip,
        words,
      };
    case "backspace":
      if (current.length <= 0) return state;
      words[state.count] = words[state.count].substring(
        0,
        words[state.count].length - 1
      );
      return { ...state, words };
    case "animationstart":
      return { ...state, animation: state.animation + 1 };
    case "animationcancel":
      return { ...state, animation: state.animation - 1 };
    case "animationend":
      const animating =
        (state.gameState === "animating" && state.animation <= 1) ||
        state.gameState === "waiting"
          ? "waiting"
          : "animating";
      return { ...state, gameState: animating, animation: state.animation - 1 };
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
    return [...answerList][value];
  }

  return {
    answer: loadsAnswer(),
    flip: [...Array(tries).keys()].map(() => false),
    words: [...Array(tries).keys()].map(() => ""),
    letters: {},
    animation: 0,
    gameState: "waiting",
    count: 0,
  };
}

function App() {
  const [state, dispatch] = useReducer(reducer, {}, init);

  const handleKeyType = useCallback(
    (letter) => {
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

  const handleKeyPress = useCallback(
    (e) => {
      const letter = e.keyCode;
      handleKeyType(letter);
    },
    [handleKeyType]
  );

  const handleAnimation = useCallback((e) => {
    dispatch({ type: e.type });
  }, []);

  // document listeners
  useEffect(() => {
    Object.keys(mapAccent).forEach((k) => {
      if (!wordList.has(k)) console.log(k);
    });
    document.addEventListener("animationstart", handleAnimation);
    document.addEventListener("animationend", handleAnimation);
    document.addEventListener("animationcancel", handleAnimation);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("animationstart", handleAnimation);
      document.removeEventListener("animationend", handleAnimation);
      document.removeEventListener("animationcancel", handleAnimation);
    };
  }, [handleKeyPress, handleAnimation]);

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
              disabled={
                (state.gameState === "animating" && index >= state.count) ||
                index > state.count
              }
            />
          ))}
        </Board>
        <Keyboard action={handleKeyType} />
      </div>
    </div>
  );
}

export default App;
