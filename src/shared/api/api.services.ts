import { AxiosRequestConfig } from 'axios';
import { api } from './api.instance';
import { LoginUserDtoSchema } from './api.contracts';

export function loginUser(loginUserDto: any, config?: AxiosRequestConfig<any>) {
  const data = LoginUserDtoSchema.parse(loginUserDto);
  return api.post('/user-auth/login', data, config);
}

export function registerUser(data: any, config?: AxiosRequestConfig) {
  return api.post('/user-auth/register', data, config);
}

export function logoutUser(config?: AxiosRequestConfig) {
  return api.post('/user-auth/logout', config);
}

export function getUserProfile(config?: AxiosRequestConfig) {
  return api.get('/user/profile', config);
}

export function updateSelfUserProfile(data: any, config?: AxiosRequestConfig) {
  return api.put('/user/profile', data, config);
}

export function getTextile(config?: AxiosRequestConfig) {
  return api.get('/textiles', config);
}

export function getUsers(sp: any, config?: AxiosRequestConfig) {
  return api.get('/user', config);
}

export function createUser(data: any, config?: AxiosRequestConfig) {
  return api.post('/user', data, config);
}

export function userDetails(id: string, config?: AxiosRequestConfig) {
  return api.get(`/user/${id}`, config);
}

export function userUpdate(id: string, data: any, config?: AxiosRequestConfig) {
  return api.put(`/user/${id}`, data, config);
}

export function userDelete(id: string, data?: any) {
  return api.delete(`/user/${id}`, data);
}

// ----------------------------------------------------------------------
// Products

export function getProducts(params?: any, config?: AxiosRequestConfig) {
  return api.get('/products', { params, ...config });
}

export function getProductById(id: string, config?: AxiosRequestConfig) {
  return api.get(`/products/${id}`, config);
}

export function getProductByBarcode(barcode: string, config?: AxiosRequestConfig) {
  return api.get(`/products/barcode/${barcode}`, config);
}

export function createProduct(data: any, config?: AxiosRequestConfig) {
  return api.post('/products', data, config);
}

export function updateProduct(id: string, data: any, config?: AxiosRequestConfig) {
  return api.put(`/products/${id}`, data, config);
}

export function deleteProduct(id: string, config?: AxiosRequestConfig) {
  return api.delete(`/products/${id}`, config);
}

// ----------------------------------------------------------------------
// Suppliers

export function getSuppliers(params?: any, config?: AxiosRequestConfig) {
  return api.get('/suppliers', { params, ...config });
}

export function getSupplierById(id: string, config?: AxiosRequestConfig) {
  return api.get(`/suppliers/${id}`, config);
}

export function createSupplier(data: any, config?: AxiosRequestConfig) {
  return api.post('/suppliers', data, config);
}

export function updateSupplier(id: string, data: any, config?: AxiosRequestConfig) {
  return api.put(`/suppliers/${id}`, data, config);
}

export function deleteSupplier(id: string, config?: AxiosRequestConfig) {
  return api.delete(`/suppliers/${id}`, config);
}

// ----------------------------------------------------------------------
// Tills

export function getTills(params?: any, config?: AxiosRequestConfig) {
  return api.get('/tills', { params, ...config });
}

export function getTillById(id: string, config?: AxiosRequestConfig) {
  return api.get(`/tills/${id}`, config);
}

export function createTill(data: any, config?: AxiosRequestConfig) {
  return api.post('/tills', data, config);
}

export function openTill(id: string, data: any, config?: AxiosRequestConfig) {
  return api.post(`/tills/${id}/open`, data, config);
}

export function closeTill(id: string, data: any, config?: AxiosRequestConfig) {
  return api.post(`/tills/${id}/close`, data, config);
}

export function linkTill(id: string, data: any, config?: AxiosRequestConfig) {
  return api.post(`/tills/${id}/link`, data, config);
}

export function blockTill(id: string, data: any, config?: AxiosRequestConfig) {
  return api.patch(`/tills/${id}/block`, data, config);
}

// ----------------------------------------------------------------------
// Purchases

export function createPurchase(data: any, config?: AxiosRequestConfig) {
  return api.post('/purchases', data, config);
}

export function getProductBatches(productId: string, config?: AxiosRequestConfig) {
  return api.get(`/purchases/batches/product/${productId}`, config);
}

export function getPurchaseReport(params?: any, config?: AxiosRequestConfig) {
  return api.get('/purchases/reports', { params, ...config });
}

export function getPurchaseInvoiceById(idOrNumber: string, config?: AxiosRequestConfig) {
  return api.get(`/purchases/invoices/${idOrNumber}`, config);
}

// ----------------------------------------------------------------------
// Sales

export function createSale(data: any, config?: AxiosRequestConfig) {
  return api.post('/sales', data, config);
}

export function getSalesTransactions(params?: any, config?: AxiosRequestConfig) {
  return api.get('/sales/transactions', { params, ...config });
}

export function getSalesInvoices(params?: any, config?: AxiosRequestConfig) {
  return api.get('/sales/invoices', { params, ...config });
}

export function getSalesInvoiceById(id: string, config?: AxiosRequestConfig) {
  return api.get(`/sales/invoices/${id}`, config);
}

export function voidSalesInvoice(id: string, config?: AxiosRequestConfig) {
  return api.delete(`/sales/invoices/${id}`, config);
}

export function getSalesReport(params?: any, config?: AxiosRequestConfig) {
  return api.get('/sales/reports', { params, ...config });
}
