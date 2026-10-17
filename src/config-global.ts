export const PATH_AFTER_LOGIN = '/';

export const IS_PROD = import.meta.env.MODE === 'production';
export const IS_DEV = import.meta.env.MODE === 'development';
export const NODE_ENV = import.meta.env.MODE;

export const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME;
export const HOST_URL = import.meta.env.VITE_HOST_URL;
export const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;
export const SERVER_BASE_URL = IS_PROD
  ? 'https://textile-epos-be.onrender.com/api'
  : 'http://localhost:3000/api';
