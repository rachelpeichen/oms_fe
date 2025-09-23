import type { CampaignDetail, CampaignDetailResponse, CampaignsListResponse, LineItemDetail, LineItemDetailResponse, InvoiceDetail, InvoiceDetailResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


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

export const fetchLineItemDetail = async (id: number): Promise<LineItemDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/lineitems/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LineItemDetailResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching line item detail:', error);
    throw error;
  }
};

export const fetchInvoiceDetail = async (id: number): Promise<InvoiceDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: InvoiceDetailResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching invoice detail:', error);
    throw error;
  }
};

export const updateInvoiceAdjustment = async (id: number, adjustment: number): Promise<{ data: { id: number; line_item_id: number; adjustments: number; createdAt: string; updatedAt: string; }; message: string; }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}/adjustment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adjustment }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating invoice adjustment:', error);
    throw error;
  }
};
