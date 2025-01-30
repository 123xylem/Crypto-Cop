import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const SocialChecker = ({ mint }: { mint: string }) => {
  const [socialsData, setSocialsData] = useState<[[string], [string]][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sitesFound, setSitesFound] = useState<number>(0);

  useEffect(() => {
    const fetchSocialsData = async () => {
      setLoading(true);
      setSocialsData([]);
      setSitesFound(0);
      try {
        const pump_url = `${API_URL}pump-coin-socials/${mint}`;
        const data = await fetch(pump_url).then((res) => res.json());
        const websites: [[string], [string]][] = [];
        let foundCount = 0;
        data?.forEach((site: string[]) => {
          if (site[1] != "Not found") {
            foundCount++;
          }

          websites.push([[site[0] + " "], [site[1]]]);
        });
        setSitesFound(foundCount);
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
      <h3 className="col-title">Social Sites</h3>

      {loading ? (
        <p>Loading social data...</p>
      ) : socialsData.length > 0 ? (
        <>
          <div className={"status-bar " + (sitesFound > 0 ? " green" : "red")}>
            <h3 className="col-subtitle ">{sitesFound} Sites Found</h3>
          </div>

          {Object.values(socialsData).map((site) => {
            return (
              <div className="social-site">
                <strong>{site[0]} </strong>
                {site[1]}
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
