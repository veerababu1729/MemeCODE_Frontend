// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  CREATE_ORDER: `${API_BASE_URL}/api/create-order`,
  VERIFY_PAYMENT: `${API_BASE_URL}/api/verify-payment`,
  SUBMIT_DETAILS: `${API_BASE_URL}/api/submit-details`,
  GET_USER_DETAILS: `${API_BASE_URL}/api/user-details`,
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  HEALTH_CHECK: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
