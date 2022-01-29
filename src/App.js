import "./App.css";

import Grid from "./components/Grid";
import Board from "./components/Board";
import { useState } from "react";

function App() {
  const [animate, setAnimate] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("luigi");

  return (
    <div className="App">
      <header>
        <span>(NOT) TERMO</span>
      </header>
      <div className="main-game">
        <Board>
          <Grid
            correctAnswer={correctAnswer}
            word=""
            size={5}
            animate={animate}
          />
          <Grid correctAnswer={correctAnswer} word="" size={5} />
          <Grid correctAnswer={correctAnswer} word="" size={5} />
          <Grid correctAnswer={correctAnswer} word="" size={5} />
          <Grid correctAnswer={correctAnswer} word="" size={5} />
        </Board>
      </div>
    </div>
  );
}

export default App;
