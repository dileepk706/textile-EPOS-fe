export type TillStatus = 'open' | 'closed' | 'blocked';

export interface Till {
  id: string;
  _id?: string;
  name: string;
  code: string;
  status: TillStatus;
  is_blocked: boolean;
  cash_in_till: number;
  opening_balance: number;
  closing_balance?: number | null;
  discrepancy?: number | null;
  is_linked?: boolean;
  device_info?: string | null;
  assigned_user_id?: string | null;
  notes?: string | null;
  textile_id?: string;
  opened_at?: string;
  closed_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TillFilterParams {
  status?: TillStatus;
  is_linked?: boolean | string;
}

export interface TillsResponseData {
  tills: Till[];
  count: number;
}
