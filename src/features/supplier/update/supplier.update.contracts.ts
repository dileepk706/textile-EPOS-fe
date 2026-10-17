import { z } from 'zod';

export const updateSupplierFormSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  gstin: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type UpdateSupplierFormDto = z.infer<typeof updateSupplierFormSchema>;
