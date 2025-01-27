import "./App.css";
import FormHandler from "./FormHandler";
import WalletProvider from "./components/WalletProvider";

function App() {
  return (
    <>
      <WalletProvider>
        <FormHandler></FormHandler>
      </WalletProvider>
    </>
  );
}

export default App;
