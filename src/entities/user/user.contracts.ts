import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  phone: z.string(),
  role: z.string(),
  user_type: z.string(),
  tenant_id: z.string(),
  textile_id: z.string(),
  is_active: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
