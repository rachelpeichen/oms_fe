import type { CampaignDetail, CampaignDetailResponse, CampaignsListResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';


export const fetchCampaigns = async (page: number = 1): Promise<CampaignsListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns?page=${page}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CampaignsListResponse = await response.json();

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
      data: campaigns,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const fetchCampaignDetail = async (id: number): Promise<CampaignDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CampaignDetailResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching campaign detail:', error);
    throw error;
  }
};
