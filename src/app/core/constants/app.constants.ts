export const APP_CONSTANTS = {
  RETRY: {
    COUNT: 2,
    DELAY_MS: 1000,
  },
  FULL_PAGE_ROUTES: {
    LEVEL_SELECTION: '/onboarding/level-selection',
    INTEREST_SELECTION: '/onboarding/interest-selection',
  },
  APP_ROUTES: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    EMAIL_VERIFICATION: '/email-verification',
    DASHBOARD: '/dashboard',
  },
  API_ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-email-otp',
    LOGOUT: '/auth/logout',
    COMPLETE_ONBOARDING: '/users/complete-onboarding',
    SOCIAL_LOGIN: '/oauth2/authorization',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
} as const;
