import { z } from 'zod';

export const SubscriptionSchema = z.object({
  plan_id: z.string().min(1, {
    message: 'plan_id is required.',
  }),
});

export type TSubscription = z.infer<typeof SubscriptionSchema>;
