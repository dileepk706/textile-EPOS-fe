export interface ProductBatch {
  id?: string;
  _id?: string;
  batch_no?: string;
  batch_number?: string;
  quantity?: number;
  available_quantity?: number;
  cost_price: number;
  selling_price: number;
  mrp?: number;
  serial_numbers?: string[];
  mfg_date?: string;
  expiry_date?: string;
  created_at?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  categories?: string;
  category?: string;
  barcode: string;
  deleted?: string;
  unit?: string;
  sku?: string;
  brand?: string;
  textile_id?: string | null;
  tenant_id?: string | null;
  is_active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // EPOS Inventory fields
  price?: number;
  cost_price?: number;
  costPrice?: number;
  selling_price?: number;
  available_stock?: number;
  stock?: number;
  batches?: ProductBatch[];
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  barcode?: string;
  is_active?: boolean;
}

export interface ProductsResponseData {
  products: Product[];
  count: number;
}
