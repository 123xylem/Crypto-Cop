import { forwardRef, useImperativeHandle, useState } from "react";

export interface RugCheckerRef {
  submit: (mint: string) => Promise<void>;
}

const RugChecker = forwardRef<RugCheckerRef, {}>((_, ref) => {
  const [result, setResult] = useState<Record<string, unknown>>({});

  useImperativeHandle(ref, () => ({
    submit: async (mint: string) => {
      try {
        const response = await fetch(
          `https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`
        );
        if (!response.ok) {
          console.error("Failed to fetch data:", response.status);
          return;
        }
        const data = await response.json();

        setResult(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  }));

  return (
    //todo hide wallet on connection
    <div className="column">
      {result
        ? Object.values(result).length > 0 && (
            <pre>
              {" "}
              <h2 className="col-title">Rug Stats</h2>
              {JSON.stringify(result, null, 2)}
            </pre> // Pretty print the JSON object
          )
        : ""}
    </div>
  );
});

export default RugChecker;
