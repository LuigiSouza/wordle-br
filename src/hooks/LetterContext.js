import React, { useCallback, useState, useContext, createContext } from "react";

const LetterContext = createContext({});

const statusHeight = {
  none: 0,
  wrong: 1,
  close: 2,
  correct: 3,
};

function LetterProvider({ children }) {
  const [letterStatus, setLetterStatus] = useState(() => {
    const keyboard = {};
    for (let i = 65; i <= 90; i++) keyboard[String.fromCharCode(i)] = "none";
    return keyboard;
  });

  const updateKeyboard = useCallback(
    (word) => {
      const newStatus = { ...letterStatus };
      for (const char of word) {
        const currentWeight = statusHeight[letterStatus[char.letter]];
        const newWeight = statusHeight[char.status];
        if (newWeight > currentWeight) newStatus[char.letter] = char.status;
      }
      setLetterStatus(newStatus);
    },
    [letterStatus]
  );

  return (
    <LetterContext.Provider value={{ letterStatus, updateKeyboard }}>
      {children}
    </LetterContext.Provider>
  );
}

function useLettersData() {
  const context = useContext(LetterContext);
  if (!context) {
    throw new Error("You must use useLettersData inside an LetterProvider");
  }

  return context;
}

export { LetterProvider, useLettersData };
