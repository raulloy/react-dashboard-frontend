import { useEffect, useState } from 'react';
import { googleAccounts } from './data';
import { googleCampaignsData } from './google';

export const AccountComponent = ({ since, until, accountId }) => {
  const [googleCampaignInsights, setGoogleCampaignInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Campaign Insights
        const campaignsResponse = await googleCampaignsData(
          accountId,
          since,
          until
        );
        setGoogleCampaignInsights(campaignsResponse);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [since, until, accountId]);

  useEffect(() => {
    // Calculate total spend
    const spend = googleCampaignInsights.reduce(
      (total, insight) => total + insight.metrics.cost_micros,
      0
    );
    setTotalSpend(spend);
  }, [googleCampaignInsights]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ height: '26px' }}>
          <p
            style={{
              width: '280px',
              display: 'inline-block',
            }}
          >
            {googleAccounts.find((account) => account.id === accountId)?.name}
          </p>
          ${(totalSpend / 1000000).toLocaleString('en-US')}
        </div>
      )}
    </div>
  );
};

export const GoogleSpendByAccount = (since, until, accountId) => {
  const [googleCampaignInsights, setGoogleCampaignInsights] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await googleCampaignsData(
          accountId,
          since,
          until
        );
        setGoogleCampaignInsights(campaignsResponse);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [since, until, accountId]);

  useEffect(() => {
    // Calculate total spend
    const spend = googleCampaignInsights.reduce(
      (total, insight) => total + insight.metrics.cost_micros,
      0
    );
    setTotalSpend(spend);
  }, [googleCampaignInsights]);

  return totalSpend;
};

export const GoogleCPCByAccount = (since, until, accountId) => {
  const [googleCampaignInsights, setGoogleCampaignInsights] = useState([]);
  const [averageCPC, setAverageCPC] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await googleCampaignsData(
          accountId,
          since,
          until
        );
        setGoogleCampaignInsights(campaignsResponse);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [since, until, accountId]);

  useEffect(() => {
    // Calculate average cpc
    const average_cpc =
      googleCampaignInsights.reduce(
        (total, insight) => total + insight.metrics.average_cpc,
        0
      ) / googleCampaignInsights.length;
    setAverageCPC(average_cpc);
  }, [googleCampaignInsights]);

  return averageCPC;
};

export const GoogleLeadsByAccount = (since, until, accountId) => {
  const [googleCampaignInsights, setGoogleCampaignInsights] = useState([]);
  const [totalConversions, setTotalConversions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await googleCampaignsData(
          accountId,
          since,
          until
        );
        setGoogleCampaignInsights(campaignsResponse);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [since, until, accountId]);

  useEffect(() => {
    // Calculate total conversions
    const conversions = googleCampaignInsights.reduce(
      (total, insight) => total + insight.metrics.conversions,
      0
    );
    setTotalConversions(conversions);
  }, [googleCampaignInsights]);

  return totalConversions;
};

export const GoogleDataByAccount = (since, until, accountId) => {
  const [googleCampaignInsights, setGoogleCampaignInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await googleCampaignsData(
          accountId,
          since,
          until
        );
        setGoogleCampaignInsights(campaignsResponse);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [since, until, accountId]);

  return googleCampaignInsights;
};
