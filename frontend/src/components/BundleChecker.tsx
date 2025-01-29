import React, { useEffect, useState } from "react";

type BundleData = Record<string, unknown>;

const BundleChecker: React.FC<{ mint: string }> = ({ mint }) => {
  const [bundleData, setBundleData] = useState<BundleData>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBundleData = async () => {
      setLoading(true);
      try {
        const url = `https://trench.bot/api/bundle/bundle_advanced/${mint}`;
        const data = await fetch(url).then((res) => res.json());
        setBundleData(data);
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

  return (
    <div className="bundlechecker column">
      {loading ? (
        <p>Loading bundle data...</p>
      ) : Object.keys(bundleData).length > 0 ? (
        <pre>
          <h2 className="col-title">Bundle Stats</h2>
          {JSON.stringify(bundleData, null, 2)}
        </pre>
      ) : (
        <p>No bundle data available</p>
      )}
    </div>
  );
};

export default BundleChecker;
