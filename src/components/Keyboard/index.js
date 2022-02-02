import KeyPress from "./Key";
import { useLettersData } from "../../hooks/LetterContext";

import styles from "./styles.module.css";

const fstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const sndRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const thdRow = ["Z", "X", "C", "V", "B", "N", "M"];

function Keyboard({ action }) {
  const { letterStatus } = useLettersData();

  return (
    <div className={styles.keyboard}>
      <div>
        {fstRow.map((key, index) => (
          <KeyPress
            action={() => action(key.charCodeAt(0))}
            key={index}
            status={letterStatus[key]}
          >
            {key}
          </KeyPress>
        ))}
      </div>
      <div>
        {sndRow.map((key, index) => (
          <KeyPress
            action={() => action(key.charCodeAt(0))}
            key={index}
            status={letterStatus[key]}
          >
            {key}
          </KeyPress>
        ))}
        <KeyPress action={() => action(8)}>&#9003;</KeyPress>
      </div>
      <div>
        {thdRow.map((key, index) => (
          <KeyPress
            action={() => action(key.charCodeAt(0))}
            key={index}
            status={letterStatus[key]}
          >
            {key}
          </KeyPress>
        ))}
        <KeyPress action={() => action(13)}>ENTER</KeyPress>
      </div>
    </div>
  );
}

export default Keyboard;
