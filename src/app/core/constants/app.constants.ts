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
} as const;
