export type ApiErrorData = {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: any;
};

export type CurrentSubscriptionResponseDto = {
  subscription?: any;
  invoice?: any;
  plan?: any;
  [key: string]: any;
};
