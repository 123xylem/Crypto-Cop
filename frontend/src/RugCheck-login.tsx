import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface RugCheckerRef {
  submit: (mint: string) => Promise<void>;
}

const RugChecker = forwardRef<RugCheckerRef, {}>((_, ref) => {
  const { publicKey, signMessage } = useWallet();
  const [connectedWallet, setConnectedWallet] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    submit: async (mint: string) => {
      console.log("Submit method called with mint:", mint);
    },
  }));

  const authoriseRugCheck = async () => {
    if (!publicKey || !signMessage) {
      alert("Please connect your Solana wallet to view RugCheck results.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create the message payload
      const messageContent = "Sign-in to Rugcheck.xyz";
      const timestamp = Date.now();
      const message = {
        message: messageContent,
        publicKey: publicKey.toBase58(),
        timestamp,
      };

      // Step 2: Encode the message for signing
      const encodedMessage = new TextEncoder().encode(JSON.stringify(message));

      // Step 3: Sign the message using the wallet
      const signature = await signMessage(encodedMessage);

      // Step 4: Prepare the POST request payload
      const payload = {
        message,
        signature: {
          data: Array.from(signature),
          type: "Buffer",
        },
        wallet: publicKey.toBase58(),
      };

      // Step 5: Send the request to RugCheck API
      const response = await fetch(
        "https://api.rugcheck.xyz/v1/auth/login/solana",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConnectedWallet(true);
        console.log("Login successful:", data);
        alert("Login successful! Token: " + data.token);
        setResult(JSON.stringify(data));
      } else {
        console.error("Login failed:", response.status, await response.text());
        alert("Login failed. Check console for details.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    //todo hide wallet on connection
    <div>
      {!connectedWallet ? (
        <>
          <button onClick={authoriseRugCheck} disabled={!publicKey || loading}>
            {loading ? "Processing..." : "Connect wallet to use RugChecker"}
          </button>
          <WalletMultiButton />
        </>
      ) : result ? (
        <p>Result: {result}</p>
      ) : (
        ""
      )}
    </div>
  );
});

export default RugChecker;
