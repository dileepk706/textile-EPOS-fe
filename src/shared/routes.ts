export const pathKeys = {
  root: '/',
  customers: '/customers',
  login: '/login/',
  page404: '/404/',

  products: '/products',
  product: {
    root: '/products',
    create: '/create',
    createFP: '/products/create',
    update: '/update',
    updateFP: '/products/update',
  },

  suppliers: '/suppliers',
  supplier: {
    root: '/suppliers',
    create: '/create',
    createFP: '/suppliers/create',
    update: '/update',
    updateFP: '/suppliers/update',
  },

  profile: '/profile/',
  account: (_isRoot?: boolean) => ({
    root: '/account',
    setting: '/account/setting',
    plan: '/account/plan',
  }),
  settings: {
    root: '/settings',
    gym: '/settings/gym',
    user: '/settings/user',
  },

  staff: {
    root: '/staff',
    create: '/create',
    createFP: '/staff/create',
    update: '/update',
    updateFP: '/staff/update',
    RRoles: '/staff/roles',
  },

  onboarding: '/onboarding',
  gym: (_isRoot?: boolean) => ({
    root: '/gym',
    schedule: 'schedule',
    staffs: 'staffs',
  }),
  members: () => ({
    root: '/members',
    create: '/members/create',
  }),

  reports: {
    sales: '/reports/sales',
    salesInvoice: (id: string = ':id') => `/reports/sales/invoice/${id}`,
    purchases: '/reports/purchases',
    purchaseInvoice: (id: string = ':id') => `/reports/purchases/invoice/${id}`,
  },

  setuptill: '/setup-till',
  setupTillFP: '/billing/setup-till',
  billing: {
    root: '/billing',
    customer: '/billing/customer',
    supplierFP: '/billing/supplier',
    supplier: '/billing/supplier',
    purchaseCart: '/billing/purchase/cart',
    purchaseCheckout: '/billing/purchase/checkout',
    salesReport: '/billing/reports/sales',
    salesInvoice: (id: string = ':id') => `/billing/reports/sales/invoice/${id}`,
    purchaseReport: '/billing/reports/purchases',
    purchaseInvoice: (id: string = ':id') => `/billing/reports/purchases/invoice/${id}`,
  },
};
