export type Subscription = {
  id?: string;
  name?: string;
  status?: string;
  [key: string]: any;
};

export type Invoice = {
  id?: string;
  [key: string]: any;
};

export type SubscriptionPlanFeature = {
  id: string;
  name: string;
  [key: string]: any;
};

export type SubscriptionPlanLimit = {
  key: string;
  value?: any;
  [key: string]: any;
};

export type SubscriptionPlan = {
  id?: string;
  name?: string;
  price?: number;
  features?: SubscriptionPlanFeature[];
  limits: SubscriptionPlanLimit[];
  [key: string]: any;
};

export const currentSubscriptionQueryOptions = () => ({
  queryKey: ['subscription', 'current'],
  queryFn: async (): Promise<{ data: any }> => ({
    data: {
      subscription: { status: 'active' },
      plan: null,
      invoice: null,
    },
  }),
});

export const getSubscriptionQueryOptions = currentSubscriptionQueryOptions;

export const useSubscriptionStore = {
  getState: () => ({
    setLoading: (_val: boolean) => {},
    setSubscriptionDetails: (_val: any) => {},
    clearSubscription: () => {},
    setError: (_val: any) => {},
  }),
};
