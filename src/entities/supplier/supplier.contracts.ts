import { z } from 'zod';

export const supplierSchema = z.object({
  id: z.string(),
  _id: z.string().optional(),
  name: z.string().min(1, 'Supplier name is required'),
  contact_person: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional().default(''),
  gstin: z.string().optional().default(''),
  deleted: z.union([z.string(), z.boolean()]).optional().default('false'),
  is_active: z.boolean().optional().default(true),
  textile_id: z.string().optional().nullable(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
