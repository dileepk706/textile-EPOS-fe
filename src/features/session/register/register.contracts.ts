import { z } from 'zod';

export const RegisterUserSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Full name is required.',
    }),
    email: z.email({
      message: 'Oops! The email address you entered is invalid.',
    }),
    password: z.string().min(8, {
      message: 'Your password must be at least 8 characters long.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Your password must be at least 8 characters long.',
    }),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy to continue.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type TRegisterUser = z.infer<typeof RegisterUserSchema>;
