import { LetterProvider } from "./LetterContext";

function Providers({ children }) {
  return <LetterProvider>{children}</LetterProvider>;
}

export default Providers;
