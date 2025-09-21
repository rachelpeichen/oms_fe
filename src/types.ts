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
    lineItemCount: number;
    totalBooked: number;
    totalActual: number;
    totalAdjustment: number;
}

export interface CampaignsListResponse {
  data: Campaign[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CampaignDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  LineItems: LineItem[];
}

export interface CampaignDetailResponse {
  data: CampaignDetail;
}