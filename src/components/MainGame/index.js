import { useCallback, useEffect, useReducer, useMemo } from "react";

import Grid from "../Grid";
import Board from "../Board";
import Keyboard from "../Keyboard";

import { mapAccent, answerList, wordList } from "../../utils/words";
import { mulberry32, deNormalize } from "../../utils/random";

import styles from "./styles.module.css";

const size = 5;
const tries = 6;

function reducer(state, action) {
  const words = [...state.words];
  const current = state.words[state.count];
  const toast = state.toast !== "none" ? "hide" : "none";
  switch (action.type) {
    case "write":
      if (state.gameState !== "waiting") return state;
      if (current.length >= size) return { ...state, toast };
      words[state.count] += String.fromCharCode(action.letter);
      return { ...state, words, toast };
    case "submit":
      if (state.count >= tries || current.length < size) return state;
      const currentLower = current.toLowerCase();
      if (!wordList.has(currentLower)) return { ...state, toast: "show" };
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
      return { ...state, words, toast };
    case "animationstart":
      return { ...state, animation: state.animation + 1 };
    case "animationcancel":
      return { ...state, animation: state.animation - 1 };
    case "animationend":
      if (state.gameState === "waiting")
        return { ...state, animation: state.animation - 1 };
      let gameState = state.gameState;
      if (state.gameState === "animating" && state.animation <= 1) {
        if (words[state.count - 1] === state.answer) gameState = "win";
        // correct answer
        else if (state.count === tries) gameState = "lose";
        //wrong answer
        else gameState = "waiting";
        // continue game
      }
      const newToast =
        gameState !== "waiting" && gameState !== "animating" ? "show" : toast;
      return {
        ...state,
        gameState,
        toast: newToast,
        animation: state.animation - 1,
      };
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
    return [...answerList][value].toUpperCase();
  }

  return {
    answer: loadsAnswer(),
    flip: [...Array(tries).keys()].map(() => false),
    words: [...Array(tries).keys()].map(() => ""),
    animation: 0,
    gameState: "waiting",
    toast: "none",
    count: 0,
  };
}

const winMessages = {
  1: "Perfeito!",
  2: "Extraordinário!",
  3: "Incrível!",
  4: "Bem jogado!",
  5: "Muito bem!",
  6: "Parabéns!",
};

function MainGame() {
  const [state, dispatch] = useReducer(reducer, {}, init);

  const handleKeyType = useCallback((letter) => {
    if (letter >= 65 && letter <= 90) {
      dispatch({ type: "write", letter });
    }
    if (letter === 13) {
      dispatch({ type: "submit" });
    }
    if (letter === 8) {
      dispatch({ type: "backspace" });
    }
  }, []);

  const handleKeyPress = useCallback((e) => {
    const letter = e.keyCode;
    handleKeyType(letter);
  }, []);

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
  }, []);

  const toastMessages = useMemo(() => {
    return {
      win: winMessages[state.count || 1],
      lose: state.answer,
      waiting: "Esta não é uma palavra válida",
      animating: "Easter Egg|",
    };
  }, [state]);

  return (
    <div className={styles.page}>
      <header>
        <span>(NOT) TERMO</span>
      </header>
      <div className={styles.mainGame}>
        <div className={`${styles.warning} ${styles[state.toast]}`}>
          <span>{toastMessages[state.gameState]}</span>
        </div>
        <Board>
          {[...Array(tries).keys()].map((index) => (
            <Grid
              key={index}
              correctAnswer={state.answer}
              word={state.words[index]}
              size={size}
              flip={state.flip[index]}
              disabled={
                (state.gameState !== "waiting" && index >= state.count) ||
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

export default MainGame;
