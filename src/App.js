import MainGame from "./components/MainGame";
import AppProviders from "./hooks/index";

function App() {
  return (
    <AppProviders>
      <MainGame />
    </AppProviders>
  );
}

export default App;
