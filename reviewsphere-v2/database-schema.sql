-- ReviewSphere Database Schema
-- Required tables for Google Business Profile integration and review management

-- Table: google_business_accounts
-- Stores linked Google Business Profile accounts
CREATE TABLE IF NOT EXISTS google_business_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_name TEXT,
  location_id TEXT NOT NULL,
  location_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Table: google_reviews
-- Stores fetched Google reviews
CREATE TABLE IF NOT EXISTS google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_account_id UUID REFERENCES google_business_accounts(id) ON DELETE CASCADE,
  google_review_id TEXT NOT NULL UNIQUE,
  reviewer_name TEXT,
  reviewer_photo_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date TIMESTAMPTZ,
  reply_status TEXT DEFAULT 'pending' CHECK (reply_status IN ('pending', 'generating', 'awaiting_approval', 'approved', 'posted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: review_replies
-- Stores AI-generated replies and their approval status
CREATE TABLE IF NOT EXISTS review_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES google_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  generated_reply TEXT NOT NULL,
  tone TEXT DEFAULT 'professional',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted')),
  approved_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: oauth_tokens (if not exists)
-- Stores OAuth tokens for various providers
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  tokens JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_google_reviews_user_id ON google_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_google_reviews_status ON google_reviews(reply_status);
CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON review_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_status ON review_replies(status);
CREATE INDEX IF NOT EXISTS idx_google_business_accounts_user_id ON google_business_accounts(user_id);

-- Enable Row Level Security
ALTER TABLE google_business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own business accounts" ON google_business_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business accounts" ON google_business_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business accounts" ON google_business_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reviews" ON google_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own replies" ON review_replies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own replies" ON review_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON review_replies
  FOR UPDATE USING (auth.uid() = user_id);
