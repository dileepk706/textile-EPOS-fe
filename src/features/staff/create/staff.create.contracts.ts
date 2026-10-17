import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(3, 'Password must be at least 3 characters long').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CASHIER']),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
