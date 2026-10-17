import { z } from 'zod';

// Base response schema for all API calls
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

export const ApiErrorDataDtoSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});

export const ApiErrorDataSchema = z.array(z.string());

export const LoginUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
