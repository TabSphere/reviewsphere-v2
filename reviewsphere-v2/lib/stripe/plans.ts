// Central map of all plans → Stripe Price IDs, limits and pricing
// This is the single source of truth — update here to add new plans

export type PlanConfig = {
  priceId: string | undefined;
  name: string;
  generationLimit: number;
  credits: number;
  priceGBP: number;
  isSubscription: boolean;
};

export const PLAN_CONFIG: Record<string, PlanConfig> = {
  starter: {
    priceId:          process.env.STRIPE_PRICE_STARTER,
    name:             "Starter",
    generationLimit:  50,
    credits:          0,
    priceGBP:         19,
    isSubscription:   true,
  },
  pro: {
    priceId:          process.env.STRIPE_PRICE_PRO,
    name:             "Pro",
    generationLimit:  200,
    credits:          0,
    priceGBP:         49,
    isSubscription:   true,
  },
  credits_100: {
    priceId:          process.env.STRIPE_PRICE_CREDITS_100,
    name:             "100 Credits",
    generationLimit:  0,
    credits:          100,
    priceGBP:         9,
    isSubscription:   false,
  },
  credits_300: {
    priceId:          process.env.STRIPE_PRICE_CREDITS_300,
    name:             "300 Credits",
    generationLimit:  0,
    credits:          300,
    priceGBP:         24,
    isSubscription:   false,
  },
};

export function planFromPriceId(priceId: string): string {
  for (const [key, config] of Object.entries(PLAN_CONFIG)) {
    if (config.priceId === priceId) return key;
  }
  return "unknown";
}