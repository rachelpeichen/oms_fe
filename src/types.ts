export interface Invoice {
    id: number;
    line_item_id: number;
    adjustments: number;
}

export interface LineItem {
    id: number;
    campaign_id: number;
    name: string;
    booked_amount: number;
    actual_amount: number;
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

export interface CampaignsResponse {
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