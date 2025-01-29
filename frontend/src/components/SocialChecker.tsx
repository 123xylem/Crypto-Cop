import React, { useEffect, useState } from "react";

type Website = [url: string, label: string];

type SocialsData = {
  websites: Website[];
};

const SocialChecker: React.FC<{ mint: string }> = ({ mint }) => {
  const [socialsData, setSocialsData] = useState<SocialsData>({
    websites: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSocialsData = async () => {
      setLoading(true);
      try {
        // const dex_url = `http://127.0.0.1:5000/dex-coin-socials/${mint}`;
        const pump_url = `http://127.0.0.1:5000/pump-coin-socials/${mint}`;
        const data = await fetch(pump_url).then((res) => res.json());

        const websites: Website[] = [];

        data?.forEach((site: string[]) => {
          websites.push([site[0], site[1]]);
        });

        setSocialsData({
          websites,
        });
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
      ) : socialsData.websites.length > 0 ? (
        <pre>
          {" "}
          <h2 className="col-title">Social Stats</h2>
          {JSON.stringify(socialsData, null, 2)}
        </pre>
      ) : (
        <p>No social data available,yet.. Is it Graduated?</p>
      )}
    </div>
  );
};

export default SocialChecker;
