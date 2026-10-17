import { z } from 'zod';

export const createMembershipPlanFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Plan name is required').max(255, 'Plan name is too long'),
    description: z.string().trim().optional(),
    membership_type: z.enum(['single', 'family'], {
      error: 'membership_type must be single or family',
    }),
    billing_type: z.enum(['one_time', 'recurring'], {
      error: 'billing_type must be one_time or recurring',
    }),
    price: z
      .number({ error: 'Price is required and must be a number' })
      .min(0, 'Price must be greater than or equal to 0'),
    billing_interval: z.enum(['week', 'month', 'year'], {
      error: 'billing_interval must be week, month, or year',
    }),
    billing_interval_count: z
      .number({ error: 'Billing interval count must be an integer' })
      .int('Billing interval count must be an integer')
      .positive('Billing interval count must be a positive integer'),
    duration_days: z
      .number({ error: 'Duration days must be an integer' })
      .int('Duration days must be an integer')
      .positive('Duration days must be a positive integer'),
    max_members: z
      .number({ error: 'Max members must be an integer' })
      .int('Max members must be an integer')
      .positive('Max members must be a positive integer')
      .nullable()
      .optional()
      .or(z.nan()),
  })
  .superRefine((data, ctx) => {
    if (data.membership_type === 'family') {
      if (data.max_members === undefined || data.max_members === null || isNaN(data.max_members)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['max_members'],
          message: 'Max members is required for family membership',
        });
      }
    }
  });

export type CreateMembershipPlanFormValues = z.infer<typeof createMembershipPlanFormSchema>;
