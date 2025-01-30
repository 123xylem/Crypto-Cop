import React, { useEffect, useState } from "react";
const VITE_BUNDLE_URL = import.meta.env.VITE_BUNDLE_URL;
interface PreviousCoin {
  created_at: number;
  is_rug: boolean;
  market_cap: number;
  mint: string;
  symbol: string;
}

interface History {
  high_risk: boolean;
  previous_coins: PreviousCoin[];
  recent_rugs: number;
  rug_count: number;
  rug_percentage: number;
  total_coins_created: number;
}

interface CreatorAnalysis {
  address: string;
  history: History;
  holding_percentage: string; // updated to string as per the condition
  risk_level: string;
  warning_flags: (string | null)[];
}

interface ApiResponse {
  creator_analysis: CreatorAnalysis;
  total_holding_percentage: number;
}

interface dataFormat {
  creator: { key: string; value: any }[];
  held_amount: number;
}

const BundleChecker: React.FC<{ mint: string }> = ({ mint }) => {
  // const [bundleData, setBundleData] = useState<ApiResponse | null>(null);
  const [formattedData, setFormattedData] = useState<dataFormat | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBundleData = async () => {
      setLoading(true);
      try {
        const url = `${VITE_BUNDLE_URL}${mint}`;
        const data = await fetch(url).then((res) => res.json());
        formatData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (mint) {
      fetchBundleData();
    }
  }, [mint]);

  const formatData = (data: ApiResponse) => {
    const creatorData = Object.entries(data.creator_analysis)
      .filter(
        ([key]) =>
          key !== "address" && key !== "history" && key !== "current_holdings"
      )
      .map(([key, val]) => {
        key = key.charAt(0).toUpperCase() + key.slice(1);
        key = key.replace("_", " ");
        if (key === "holding_percentage" && parseFloat(val as string) < 1) {
          val = 0.001; // Adjust val to a string representation
        } else if (key === "holding_percentage") {
          val = Number(val);
        } else if (key === "warning_flags") {
          val = (
            <ul>
              {(val as (string | null)[])
                .filter((warning) => warning != null)
                .map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
            </ul>
          );
        }

        return { key, value: val };
      });

    const formatedData = {
      creator: creatorData,
      held_amount: data.total_holding_percentage,
    };
    setFormattedData(formatedData);
  };

  return (
    <div className="bundlechecker column">
      {loading && <p>Loading bundle data...</p>}
      {formattedData ? (
        <>
          <h3 className="col-title">Bundle Stats:</h3>
          {console.log(formattedData.held_amount, 10)}

          <div
            className={
              "status-bar " + (formattedData.held_amount < 10)
                ? " green "
                : formattedData.held_amount < 20
                ? " yellow "
                : "red"
            }
          >
            <h3 className="col-subtitle">
              Total Holdings = {formattedData.held_amount}%
            </h3>
          </div>

          <h3 className="col-subtitle">Creator Stats:</h3>
          {formattedData.creator.map(({ key, value }) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </>
      ) : (
        <p>No bundle data available</p>
      )}
    </div>
  );
};

export default BundleChecker;
