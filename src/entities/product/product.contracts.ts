import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  _id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().default(''),
  categories: z.string().optional(),
  category: z.string().optional(),
  barcode: z.string(),
  deleted: z.string().optional().default('false'),
  unit: z.string().optional().default('pcs'),
  sku: z.string().optional(),
  brand: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  price: z.number().optional(),
  cost_price: z.number().optional(),
  available_stock: z.number().optional(),
});
