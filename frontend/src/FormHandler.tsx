import React, { useState, useRef, SyntheticEvent } from "react";
import RugChecker, { RugCheckerRef } from "./components/RugChecker";
import BundleChecker from "./components/BundleChecker";
import SocialChecker from "./components/SocialChecker";
import RugCheckerLogin from "./RugCheckerLogin";
import logo from "./assets/crypto-cop.jpg";

const FormHandler: React.FC = () => {
  const [mint, setMint] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const rugCheckerRef = useRef<RugCheckerRef>(null);
  const [coinName, setcoinName] = useState("");
  const [hiddenRugLogin, setHiddenRugLogin] = useState<boolean>(true);

  function handlecoinName(data: string) {
    setcoinName(data);
  }

  const hideOnClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setHiddenRugLogin(true);
    const parentElement = (e.target as HTMLElement).parentElement;
    if (parentElement) {
      parentElement.style.display = "none";
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!mint.trim()) {
      alert("Please enter a valid mint address.");
      return;
    }

    setSubmitted(true);
    if (rugCheckerRef.current) {
      await rugCheckerRef.current.submit(mint);
    }
  };

  return (
    <>
      <img className="logo" src={logo} alt="Crypto Cop scanner" />
      <p>
        Enter SOL Address to scan eg:
        4i3aysdS3yqzxr76K62tFbGXzi4havb1mBk41tdypump{" "}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="mint">Mint Address: </label>
          <input
            type="text"
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            placeholder="Enter Solana mint address"
            required
            name="mint"
          />
        </div>
        <button className="form-btn" type="submit">
          Scan
        </button>
        <div className="login-rug-check" onClick={(e) => hideOnClick(e)}>
          <small>Hide me</small>
          <RugCheckerLogin />
        </div>
      </form>
      <div className="data-body">
        {coinName && <h3 className="col-title full-width">Coin: {coinName}</h3>}
        <RugChecker ref={rugCheckerRef} />
        {submitted && (
          <BundleChecker sendCoinName={handlecoinName} mint={mint} />
        )}
        {submitted && <SocialChecker mint={mint} />}
      </div>
    </>
  );
};

export default FormHandler;
