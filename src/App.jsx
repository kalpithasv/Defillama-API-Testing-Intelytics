import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DefiStats = () => {
  const [stats, setStats] = useState({ tvl: null, change: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.llama.fi/protocols');
        const protocols = response.data;
        console.log(protocols);
        const dojoswapId = "3965";
        const hydroprotocolId = "4084";
        const astroportId = "3117";
        const helixId = "2259";
        const dojoswap = protocols.find((protocol) => protocol.id === dojoswapId);
        console.log(dojoswap);
        const totalTvl = dojoswap.tvl;
        const oneDayChange = dojoswap.change_1d;
        const oneHourChange = dojoswap.change_1h;
        const sevenDayChange = dojoswap.change_7d;
        setStats({ tvl: totalTvl, change: oneDayChange });
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <h2>Overall Defi Statistics</h2>
          <p>Total Value Locked (TVL): ${stats.tvl}</p>
          <p>change-1d: ${stats.change}</p>
        </>
      )}
    </div>
  );
};

export default DefiStats;