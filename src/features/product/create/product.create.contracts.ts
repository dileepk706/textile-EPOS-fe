import { z } from 'zod';

export const createProductFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().optional().default('pcs'),
  price: z.coerce.number().min(0, 'Price must be positive').optional(),
  cost_price: z.coerce.number().min(0, 'Cost price must be positive').optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

export type CreateProductFormDto = z.infer<typeof createProductFormSchema>;
