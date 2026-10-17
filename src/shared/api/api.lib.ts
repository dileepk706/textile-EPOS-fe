import { AxiosResponse } from 'axios';
import { ZodType } from 'zod';

export function responseContract<Data>(schema: ZodType<Data>) {
  return function parseResponse(response: AxiosResponse<unknown>): AxiosResponse<Data> {
    const data = schema.parse(response.data);
    return { ...response, data };
  };
}

export function normalizeValidationErrors(data: any): any {
  return Object.entries(data.errors).flatMap(([field, messages]: [string, any]) =>
    messages.map((message: any) => `${field} ${message}`)
  );
}

export function getErrorMessages(error: any): string[] {
  const responseData = error?.response?.data;

  // New validation errors format with field information
  if (responseData?.errors && Array.isArray(responseData.errors) && typeof responseData.errors[0] === 'object') {
    return responseData.errors.map((e: any) => (e.field ? `${e.field}: ${e.message}` : e.message));
  }

  // 1. Array of strings (likely normalized validation errors)
  if (Array.isArray(responseData)) {
    return responseData;
  }

  // 2. Object with error.message (the new format provided by user)
  if (responseData?.error?.message) {
    return [responseData.error.message];
  }

  // 3. Object with message property
  if (responseData?.message) {
    if (responseData.message === 'Validation failed' && Array.isArray(responseData.errors)) {
      // consolidate messges?
      // but already handled above if errors is array of objects
    }
    return Array.isArray(responseData.message) ? responseData.message : [responseData.message];
  }

  // 4. Default Axios error message
  if (error?.message) {
    return [error.message];
  }

  return ['Something went wrong. Please try again.'];
}
