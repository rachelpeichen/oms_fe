import type { CampaignsResponse, Campaign, Pagination } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export interface CampaignsResult {
  campaigns: Campaign[];
  pagination: Pagination;
}

export const fetchCampaigns = async (page: number = 1): Promise<CampaignsResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns?page=${page}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CampaignsResponse = await response.json();

    // Transform the data to include calculated totals
    const campaigns = data.data.map(campaign => {
      return {
        id: campaign.id,
        name: campaign.name,
        lineItemCount: campaign.lineItemCount,
        totalBooked: campaign.totalBooked,
        totalActual: campaign.totalActual,
        totalAdjustment: campaign.totalAdjustment
      };
    });

    return {
      campaigns,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};
