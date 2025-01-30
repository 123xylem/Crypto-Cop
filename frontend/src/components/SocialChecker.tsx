import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const SocialChecker: React.FC<{ mint: string }> = ({ mint }) => {
  const [socialsData, setSocialsData] = useState<[[string], [string]][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSocialsData = async () => {
      setLoading(true);
      try {
        // const dex_url = `http://127.0.0.1:5000/dex-coin-socials/${mint}`;
        const pump_url = `${API_URL}pump-coin-socials/${mint}`;
        const data = await fetch(pump_url).then((res) => res.json());
        const websites: [[string], [string]][] = [];
        data?.forEach((site: string[]) => {
          websites.push([[site[0] + " "], [site[1]]]);
        });

        setSocialsData(websites);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (mint) {
      fetchSocialsData();
    }
  }, [mint]);

  return (
    <div className="socialChecker column">
      {loading ? (
        <p>Loading social data...</p>
      ) : socialsData.length > 0 ? (
        <>
          {" "}
          <h3 className="col-title">Social Sites</h3>
          {Object.values(socialsData).map((site) => {
            return (
              <div className="social-site">
                <p>
                  <strong>{site[0]} </strong>
                  {site[1]}
                </p>
              </div>
            );
          })}
        </>
      ) : (
        <p>No social data available,yet.. Is it Graduated?</p>
      )}
    </div>
  );
};

export default SocialChecker;
