// API Configuration - Supabase Edge Functions Only (No Render)
const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL;

if (!SUPABASE_FUNCTION_URL) {
  console.warn('⚠️ VITE_SUPABASE_FUNCTION_URL not set! API calls will fail.');
}

export const API_ENDPOINTS = {
  CREATE_ORDER: `${SUPABASE_FUNCTION_URL}/create-payment-order`,
  VERIFY_PAYMENT: `${SUPABASE_FUNCTION_URL}/verify-payment`,
  SUBMIT_DETAILS: `${SUPABASE_FUNCTION_URL}/submit-details`,
  LOGIN: `${SUPABASE_FUNCTION_URL}/login`,
  VALIDATE_COUPON: `${SUPABASE_FUNCTION_URL}/validate-coupon`,
  VERIFY_TOKEN: `${SUPABASE_FUNCTION_URL}/verify-token`,
  HEALTH_CHECK: `${SUPABASE_FUNCTION_URL}/health`,
};

export default SUPABASE_FUNCTION_URL;
