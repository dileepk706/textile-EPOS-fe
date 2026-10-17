import { z } from 'zod';

export const membershipTypeSchema = z.enum(['single', 'family']);
export type MembershipType = z.infer<typeof membershipTypeSchema>;

export const billingTypeSchema = z.enum(['one_time', 'recurring']);
export type BillingType = z.infer<typeof billingTypeSchema>;

export const billingIntervalSchema = z.enum(['week', 'month', 'year']);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;

export const membershipPlanTemplateSchema = z.object({
  id: z.string(),
  gym_id: z.string().optional(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable().optional(),
  membership_type: membershipTypeSchema,
  billing_type: billingTypeSchema,
  price: z.number().min(0),
  billing_interval: billingIntervalSchema,
  billing_interval_count: z.number().int().positive(),
  duration_days: z.number().int().positive(),
  max_members: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional().default(true),
  status: z.string(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
});

export type MembershipPlanTemplate = z.infer<typeof membershipPlanTemplateSchema>;
