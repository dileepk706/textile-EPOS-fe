import { z } from 'zod';

export const updateStaffSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters').optional().or(z.literal('')),
  role_id: z.string(),
  check_in_code: z
    .number({ invalid_type_error: 'Check in code must be a number' })
    .min(1000, 'Check in code must be at least 4 digits')
    .optional()
    .or(z.nan()),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
});

export type UpdateStaffDto = z.infer<typeof updateStaffSchema>;
