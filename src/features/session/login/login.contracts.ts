import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.string().min(1, {
    message: 'Please enter your email or mobile number.',
  }),
  password: z.string().min(1, {
    message: 'Please enter your password.',
  }),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
