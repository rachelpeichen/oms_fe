export interface Invoice {
  id: number;
  line_item_id: number;
  adjustments: number;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  id: number;
  campaign_id: number;
  name: string;
  booked_amount: number;
  actual_amount: number;
  createdAt: string;
  updatedAt: string;
  Invoice: Invoice;
}

export interface Campaign {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  LineItems: LineItem[];
}

export interface CampaignsResponse {
  data: Campaign[];
}

export interface CampaignSummary {
  id: number;
  name: string;
  lineItemsCount: number;
  totalBooked: number;
  totalActual: number;
  totalFinal: number;
}
