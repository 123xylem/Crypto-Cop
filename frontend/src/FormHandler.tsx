import React, { useState, useRef } from "react";
import RugChecker, { RugCheckerRef } from "./RugChecker";

type Website = {
  url: string;
};

type Social = {
  type: string; // Twitter, Telegram, etc.
  url: string;
};

// State type for storing the social and website data
type SocialsData = {
  websites: Website[];
  socials: Social[];
  status: string;
};

const FormHandler: React.FC = () => {
  const [mint, setMint] = useState<string>(""); // Ensure mint is a string
  const [loading, setLoading] = useState<boolean>(false); // Tracks loading state
  const [submitted, setSubmitted] = useState<boolean>(false); // Tracks submitted state
  const [bundleData, setBundleData] = useState<Record<string, unknown>>({});
  // const [rugData, setRugData] = useState<Record<string, unknown>>({});
  const [socialsData, setSocialsData] = useState<SocialsData>({
    websites: [],
    socials: [],
    status: "",
  });
  const rugCheckerRef = useRef<RugCheckerRef>(null);

  const callRugChecker = async (mint: string) => {
    try {
      if (rugCheckerRef) {
        await rugCheckerRef.current?.submit(mint);
      }
      console.log("Form submission completed.");
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred while scanning. Check the console for details.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const callBundleChecker = async (mint: string) => {
    // TODO: Need to extract data for display

    const url = `https://trench.bot/api/bundle/bundle_advanced/${mint}`;
    try {
      const data = await fetch(url).then((data) => data.json());
      console.log(data, JSON.stringify(data));
      if (data) {
        setBundleData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkSocials = async (mint: string) => {
    const url = `https://io.dexscreener.com/dex/pair-details/v3/solana/${mint}`;
    console.log(url);

    try {
      const data = await fetch(url).then((data) => data.json());
      if (data) {
        console.log(data);
        let websites: Website[] = [];
        let socials: Social[] = [];
        let status = "No socials found - try again later";

        // Loop through websites and socials and populate the arrays
        data["websites"]?.forEach((site: { url: string }) => {
          websites.push({
            url: site["url"],
          });
        });

        data["socials"]?.forEach((social: { type: string; url: string }) => {
          socials.push({
            type: social["type"],
            url: social["url"],
          });
        });
        if (socials || websites) {
          status = "Socials Found";
        }

        // Update state with the new data
        setSocialsData({
          websites,
          socials,
          status,
        });
        console.log("socials listed are ??", socialsData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!mint.trim()) {
      alert("Please enter a valid mint address.");
      return;
    }
    setSubmitted(true);
    setLoading(true); // Start loading
    try {
      //Make api calls here
      callRugChecker(mint);
      // callBundleChecker(mint);
      // TODO: needs to come from backend for cors
      // checkSocials(mint);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Crypto Cop</h1>
      <h3>Enter Address for a cop scan</h3>
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
        <button type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>
      <div className="data-body">
        <RugChecker ref={rugCheckerRef} />
        <div className="bundlechecker">
          {Object.keys(bundleData).length > 0 ? (
            <pre>{JSON.stringify(bundleData, null, 2)}</pre> // Pretty print the JSON object
          ) : submitted ? (
            <p>No bundle data available</p>
          ) : (
            ""
          )}
        </div>
        <div className="socialChecker">
          {socialsData.status.length > 0 ? (
            <pre>{JSON.stringify(socialsData, null, 2)}</pre> // Pretty print the JSON object
          ) : submitted ? (
            <p>No social data available</p>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default FormHandler;
