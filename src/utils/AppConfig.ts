import { BILLING_INTERVAL, type PricingPlan } from '@/types/Subscription';

export const AppConfig = {
  name: 'Telesis',
  tagline: 'Ask. Think. Apply.',
  description: 'AI-Powered Micro-Learning Platform',
  locales: [
    {
      id: 'en',
      name: 'English',
    },
    { id: 'fr', name: 'Français' },
  ],
  defaultLocale: 'en',
  localePrefix: 'as-needed' as const,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);

export const PLAN_ID = {
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const PricingPlanList: Record<string, PricingPlan> = {
  [PLAN_ID.STARTER]: {
    id: PLAN_ID.STARTER,
    price: 10,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_starter_test',
    devPriceId: 'price_telesis_starter_dev',
    prodPriceId: '',
    features: {
      teamMember: 5,
      website: 10,
      storage: 10,
      transfer: 10,
    },
  },
  [PLAN_ID.PRO]: {
    id: PLAN_ID.PRO,
    price: 29,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_pro_test',
    devPriceId: 'price_telesis_pro_dev',
    prodPriceId: '',
    features: {
      teamMember: 15,
      website: 50,
      storage: 50,
      transfer: 50,
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 99,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_enterprise_test',
    devPriceId: 'price_telesis_enterprise_dev',
    prodPriceId: '',
    features: {
      teamMember: 100,
      website: 500,
      storage: 500,
      transfer: 500,
    },
  },
};
