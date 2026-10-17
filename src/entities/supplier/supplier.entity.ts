export interface Supplier {
  id: string;
  _id?: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  deleted?: string | boolean;
  is_active?: boolean;
  textile_id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SupplierFilterParams {
  search?: string;
  is_active?: boolean | string;
}

export interface SuppliersResponseData {
  suppliers: Supplier[];
  count: number;
}
