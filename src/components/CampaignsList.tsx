import { useState, useEffect } from 'react';
import { CampaignSummary } from '../types';
import { fetchCampaigns } from '../services/api';
import './CampaignsList.css';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="campaigns-container">
        <h2>Campaigns</h2>
        <div className="loading">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaigns-container">
        <h2>Campaigns</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="campaigns-container">
      <h2>Campaigns</h2>
      <div className="table-container">
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Line Items</th>
              <th>Total Booked</th>
              <th>Total Actual</th>
              <th>Total Final</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="campaign-name">{campaign.name}</td>
                  <td className="line-items-count">{campaign.lineItemsCount}</td>
                  <td className="amount">{formatCurrency(campaign.totalBooked)}</td>
                  <td className="amount">{formatCurrency(campaign.totalActual)}</td>
                  <td className="amount">{formatCurrency(campaign.totalFinal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsList;
