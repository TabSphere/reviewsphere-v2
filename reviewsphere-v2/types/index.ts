// ── Database row types ────────────────────────────────────────────────────────

export type Plan = "free" | "starter" | "pro";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  plan: Plan;
  used_count: number;
  generation_limit: number;
  credits_balance: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  referral_code: string | null;
  created_at: string;
};

export type Generation = {
  id: string;
  user_id: string;
  review_text: string;
  generated_reply: string;
  tone: string;
  created_at: string;
};

// ── API response types ────────────────────────────────────────────────────────

export type DashboardPayload = {
  profile: Profile | null;
  usage: {
    used: number;
    limit: number;
    credits: number;
    plan: Plan;
  };
  history: Generation[];
};

export type GenerateRequest = {
  review_text: string;
  tone: string;
};

export type GenerateResponse = {
  reply: string;
  used: number;
  limit: number;
  credits: number;
};

export type CheckoutRequest = {
  plan: string;
};

// ── UI types ──────────────────────────────────────────────────────────────────

export type Tone = "Professional" | "Friendly" | "Empathetic" | "Concise" | "SEO Local";