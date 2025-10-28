export const APP_CONSTANTS = {
  RETRY: {
    COUNT: 2,
    DELAY_MS: 1000,
  },
  FULL_PAGE_ROUTES: {
    LEVEL_SELECTION: '/onboarding/level-selection',
    INTEREST_SELECTION: '/onboarding/interest-selection',
    PLAN_CONFIRMATION: '/plan-confirmation'
  },
   APP_ROUTES: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    EMAIL_VERIFICATION: '/email-verification'
  }
} as const;
