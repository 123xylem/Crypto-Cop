import React, { useState, useRef } from "react";
import RugChecker, { RugCheckerRef } from "./components/RugChecker";
import BundleChecker from "./components/BundleChecker";
import SocialChecker from "./components/SocialChecker";
import RugCheckerLogin from "./RugCheckerLogin";

const FormHandler: React.FC = () => {
  const [mint, setMint] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const rugCheckerRef = useRef<RugCheckerRef>(null);

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
      <h1>Crypto Cop </h1>
      <h3>
        Enter Address for a cop scan
        9YK2fcbvQiaH4HqgSMCj9nSkwnYSTuSEdPxUfmT3pump
      </h3>
      <form onSubmit={handleSubmit}>
        <label>
          Mint Address:
          <input
            type="text"
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            placeholder="Enter Solana mint address"
            required
          />
        </label>
        <button type="submit">Scan</button>
        <RugCheckerLogin />
      </form>
      <div className="data-body">
        <RugChecker ref={rugCheckerRef} />
        {submitted && <BundleChecker mint={mint} />}
        {submitted && <SocialChecker mint={mint} />}
      </div>
    </>
  );
};

export default FormHandler;
