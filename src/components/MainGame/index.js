import React, { useCallback, useEffect, useReducer, useMemo } from "react";

import Grid from "../Grid";
import Board from "../Board";
import Keyboard from "../Keyboard";

import { mapAccent, answerList, wordList } from "../../utils/words";
import { mulberry32, deNormalize } from "../../utils/random";

import { useLettersData } from "../../hooks/LetterContext";

import styles from "./styles.module.css";
import Modal from "../Modal";

const size = 5;
const tries = 6;

const updateStatus = (word, answer) => {
  const answerMap = {};
  const newStatus = ["", "", "", "", ""];
  const nomalizedAnswer = answer
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const nomalizedWord = word
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (let i = 0; i < size; i++) {
    if (nomalizedAnswer[i] === nomalizedWord[i]) newStatus[i] = "correct";
    else if (!answerMap[nomalizedAnswer[i]]) answerMap[nomalizedAnswer[i]] = 1;
    else answerMap[nomalizedAnswer[i]] += 1;
  }
  for (let i = 0; i < size; i++) {
    const letter = nomalizedWord[i];
    if (newStatus[i] !== "") continue;
    if (!answerMap[letter]) newStatus[i] = "wrong";
    else if (answerMap[letter] > 0) {
      newStatus[i] = "close";
      answerMap[letter]--;
    }
  }

  return newStatus;
};

function reducer(state, action) {
  const words = [...state.words];
  const current = state.words[state.count];
  const toast = state.toast !== "none" ? "hide" : "none";
  switch (action.type) {
    case "open-modal":
      return { ...state, modal: true };
    case "close-modal":
      return { ...state, modal: false };
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
      const wordStatus = [...state.wordStatus];
      const newStatus = updateStatus(current, state.answer);
      wordStatus[state.count] = newStatus;
      return {
        ...state,
        count: state.count + 1,
        gameState: "animating",
        wordStatus,
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
      const ended = gameState !== "waiting" && gameState !== "animating";
      const newToast = ended ? "show" : toast;
      const modal = ended ? true : state.modal;
      return {
        ...state,
        modal,
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
    wordStatus: [...Array(tries).keys()].map(() =>
      [...Array(size).keys()].map(() => "none")
    ),
    animation: 0,
    gameState: "waiting",
    toast: "none",
    count: 0,
    modal: false,
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

const mapEmoji = {
  correct: "0x1f7e9",
  wrong: "0x2b1b",
  close: "0x1f7e8",
};

function MainGame() {
  const { updateKeyboard } = useLettersData();
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

  const copyToClipboard = useCallback(() => {
    let toString = `Joguei (NOT) Termo ${state.count}/6\n\n`;
    for (let i = 0; i < state.count; i++) {
      for (const status of state.wordStatus[i]) {
        console.log(
          status,
          mapEmoji[status],
          String.fromCodePoint(mapEmoji[status])
        );
        toString += String.fromCodePoint(mapEmoji[status]);
      }
      toString += "\n";
    }
    console.log(toString);

    navigator.clipboard.writeText(toString);
  }, [state.wordStatus, state.count]);

  useEffect(() => {
    function update() {
      const newKeyboardStatus = [];
      const nomalizedWord = state.words[state.count - 1]
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const status = state.wordStatus[state.count - 1];
      status.forEach((status, index) =>
        newKeyboardStatus.push({
          letter: nomalizedWord[index],
          status: status,
        })
      );
      updateKeyboard(newKeyboardStatus);
    }

    if (state.count) update();
  }, [state.wordStatus]);

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
  }, [state.count, state.answer]);

  return (
    <div className={styles.page}>
      <header>
        <span>(NOT) TERMO</span>
      </header>
      <div
        className={styles.mainGame}
        onClick={
          state.gameState === "win" || state.gameState === "lose"
            ? () => dispatch({ type: "open-modal" })
            : () => {}
        }
      >
        <div className={`${styles.warning} ${styles[state.toast]}`}>
          <span>{toastMessages[state.gameState]}</span>
        </div>
        <Board>
          {[...Array(tries).keys()].map((index) => (
            <Grid
              key={index}
              size={size}
              word={state.words[index]}
              flip={state.flip[index]}
              status={state.wordStatus[index]}
              disabled={
                (state.gameState !== "waiting" && index >= state.count) ||
                index > state.count
              }
            />
          ))}
        </Board>
        <Keyboard action={handleKeyType} />
      </div>
      <Modal show={state.modal} hide={() => dispatch({ type: "close-modal" })}>
        <div className={styles.modal}>
          <span>Progresso</span>
          <div>
            <div>
              Resultado: {state.count} / {tries}
            </div>
            <div>
              <button onClick={copyToClipboard}>Compartilhar &#128196;</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MainGame;
