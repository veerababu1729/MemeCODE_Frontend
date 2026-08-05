const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_FUNCTION_URL) {
  console.warn('⚠️ VITE_SUPABASE_FUNCTION_URL not set! API calls will fail.');
}

if (!SUPABASE_ANON_KEY) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY not set! Supabase Edge Function calls will return 401.');
}

/**
 * Returns the required headers for every Supabase Edge Function call.
 * Supabase requires both `apikey` and `Authorization: Bearer <anon_key>`.
 */
export const getSupabaseHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY ?? '',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`,
});

export const API_ENDPOINTS = {
  CREATE_ORDER: `${SUPABASE_FUNCTION_URL}/create-payment-order`,
  VERIFY_PAYMENT: `${SUPABASE_FUNCTION_URL}/verify-payment`,
  SUBMIT_DETAILS: `${SUPABASE_FUNCTION_URL}/submit-details`,
  LOGIN: `${SUPABASE_FUNCTION_URL}/login`,
  VALIDATE_COUPON: `${SUPABASE_FUNCTION_URL}/validate-coupon`,
  VERIFY_TOKEN: `${SUPABASE_FUNCTION_URL}/verify-token`,
  HEALTH_CHECK: `${SUPABASE_FUNCTION_URL}/health`,
  FORGOT_PASSWORD: `${SUPABASE_FUNCTION_URL}/forgot-password`,
  RESET_PASSWORD: `${SUPABASE_FUNCTION_URL}/reset-password`,
};

export default SUPABASE_FUNCTION_URL;
