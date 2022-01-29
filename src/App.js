import "./App.css";

import Card from "./components/Card";
import Grid from "./components/Grid";
import Board from "./components/Board";

function App() {
  const words = ["luigi", "teste", "audio", "asdfg", "      "];

  return (
    <div className="App">
      <header>
        <span>(NOT) TERMO</span>
      </header>
      <div className="main-game">
        <Board>
          {words.map((word, index) => (
            <Grid key={index}>
              {word.split("", 5).map((letter, index) => (
                <Card key={index}>{letter}</Card>
              ))}
            </Grid>
          ))}
        </Board>
      </div>
    </div>
  );
}

export default App;
