import { forwardRef, useImperativeHandle, useState } from "react";
const RUG_URL = import.meta.env.VITE_RUG_URL;

export interface RugCheckerRef {
  submit: (mint: string) => Promise<void>;
}

interface Risk {
  name: string;
  value: string;
  description: string;
  score: number;
}

interface ApiResponse {
  risks: Risk[];
  score: string;
}

const RugChecker = forwardRef<RugCheckerRef, {}>((_, ref) => {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    submit: async (mint: string) => {
      setResult(null);
      setLoading(true);
      try {
        const response = await fetch(`${RUG_URL}${mint}/report/summary`);
        if (!response.ok) {
          console.error("Failed to fetch data:", response.status);
          return;
        }
        const data: ApiResponse = await response.json();
        setResult(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
  }));

  return (
    <div className="column">
      <h3 className="col-title">Rug Stats</h3>
      {loading && "Loading Rug Data if wallet connected...."}
      {result && (
        <>
          <div
            className={
              "status-bar " +
              (result.score > "300"
                ? "yellow"
                : result.score > "500"
                ? "red "
                : " green ")
            }
          >
            <h3 className="col-subtitle">Score: {result.score}</h3>
          </div>

          <h3 className="col-subtitle">Risks:</h3>
          {result.risks.map((risk, index) => (
            <div key={index}>
              <strong>{risk.name}</strong> <br /> -{risk.description}
            </div>
          ))}
        </>
      )}
    </div>
  );
});

export default RugChecker;
