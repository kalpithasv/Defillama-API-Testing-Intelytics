import React, { useState, useEffect } from 'react';
import axios from 'axios';

/* DeFi Llama API Endpoints
 Protocol Endpoints: https://api.llama.fi/protocols

 Use these ids to get the data for the specific protocol:
  dojoswapId = "3965";
  hydroprotocolId = "4084";
  astroportId = "3117";
  helixId = "2259";

 Data That will be collected from this API:
 - TVL (Total Value Locked)
 - Change-1d (Change in TVL over the last 24 hours) - change_1d
 - Change-7d (Change in TVL over the last 7 days) - change_7d
 - Change-1h (Change in TVL over the last 1 hour) - change_1h

 Volume data will be collected from the following endpoints:

 Astroprt Volume Endpoint : https://api.llama.fi/summary/dexs/astroport?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume;
 Helix Volume Endpoint : https://api.llama.fi/summary/dexs/helix?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume;

 Data to be accessed from the volume endpoints:
 total14dto7d - Total volume of protocol over the last 7 days.
 total24h - Total volume of protocol over the last 24 hours.
 total48hto24h -  The total trading volume of the protocol calculated from 48 hours ago to 24 hours ago. This gives you the volume for the day before yesterday.

*/

const DefiStats = () => {
  const [stats, setStats] = useState({ tvl: null, change: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.llama.fi/protocols');
        const response2 = await axios.get("https://api.llama.fi/summary/dexs/astroport?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume");
        const response3 = await axios.get("https://api.llama.fi/summary/dexs/helix?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume");
        const response4 = await axios.get("https://api.llama.fi/v2/chains");
        const response5 = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en");
        // Volume API Testing.
        const astroportVolume = response2.data;
        const astroport24hVolume = astroportVolume.total24h;
        const astroport7dVolume = astroportVolume.total14dto7d;
        const astroport48hVolume = astroportVolume.total48hto24h;
        console.log(astroport24hVolume);
        console.log(astroport7dVolume);

        const helixVolume = response3.data;
        const helix24hVolume = helixVolume.total24h;
        const helix7dVolume = helixVolume.total14dto7d;
        const helix48hVolume = helixVolume.total48hto24h;
        console.log(helix24hVolume);
        console.log(helix7dVolume);

        // Coingecko API 
        const coingeckoAPI = response5.data;
        const injectiveCoin = coingeckoAPI.find((coin) => coin.id === "injective-protocol");
        const injectivePrice = injectiveCoin.current_price;
        const injectiveMarketCap = injectiveCoin.market_cap;
        console.log(injectivePrice);
        console.log(injectiveMarketCap);

        // Injective TVL

        const chains = response4.data;
        console.log(chains);
        const injective = chains.find((chain) => chain.gecko_id === "injective-protocol");
        console.log(injective);
        const injectiveTvl = injective.tvl;
        console.log(injectiveTvl);

       

        // Protocol (TVL) API Testing.
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

          // DojoSwap Staking Value
          const dojoswapStaking = dojoswap.staking;
          console.log(dojoswapStaking);
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