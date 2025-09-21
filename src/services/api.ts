import { CampaignsResponse, CampaignSummary } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchCampaigns = async (): Promise<CampaignSummary[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CampaignsResponse = await response.json();
    
    // Transform the data to include calculated totals
    return data.data.map(campaign => {
      const lineItemsCount = campaign.LineItems.length;
      
      const totalBooked = campaign.LineItems.reduce(
        (sum, item) => sum + item.booked_amount, 
        0
      );
      
      const totalActual = campaign.LineItems.reduce(
        (sum, item) => sum + item.actual_amount, 
        0
      );
      
      const totalFinal = campaign.LineItems.reduce(
        (sum, item) => sum + item.actual_amount + (item.Invoice?.adjustments || 0), 
        0
      );
      
      return {
        id: campaign.id,
        name: campaign.name,
        lineItemsCount,
        totalBooked,
        totalActual,
        totalFinal
      };
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};
