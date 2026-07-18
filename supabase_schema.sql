-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100),
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2) DEFAULT 0.00,
  max_discount DECIMAL(10, 2), -- Only applicable if discount_type is 'percentage'
  start_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,
  max_uses INT NOT NULL DEFAULT 100,
  max_uses_per_customer INT, -- Optional limit per customer
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  times_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or disable if using simple playground policies.
-- By default, if the rest of the tables are accessible using the anon key, 
-- we will allow public read access for checkout, and full access for admin.
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;

-- Add coupon columns to orders table if they do not exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0.00;

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or disable if using simple playground policies.
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.referral_codes DISABLE ROW LEVEL SECURITY;

-- Create referral_records table
CREATE TABLE IF NOT EXISTS public.referral_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'rewarded', 'rejected')),
  reward_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (reward_status IN ('pending', 'rewarded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.referral_records DISABLE ROW LEVEL SECURITY;

-- Create user_coupons table
CREATE TABLE IF NOT EXISTS public.user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  UNIQUE(user_id, coupon_id)
);
ALTER TABLE public.user_coupons DISABLE ROW LEVEL SECURITY;

-- Create coupon_usage_history table
CREATE TABLE IF NOT EXISTS public.coupon_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  order_id VARCHAR(100) NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.coupon_usage_history DISABLE ROW LEVEL SECURITY;

-- Add is_visible column to coupons table if it does not exist
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- Create blogs table with Row Level Security (RLS)
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  cover_image TEXT,
  body_content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts" 
ON public.blogs 
FOR SELECT 
USING (status = 'published');

-- Policy 2: Allow authenticated users full read access (to drafts as well)
CREATE POLICY "Allow authenticated users full read access"
ON public.blogs
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow authenticated users to insert posts
CREATE POLICY "Allow authenticated users to insert posts"
ON public.blogs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 4: Allow authenticated users to update posts
CREATE POLICY "Allow authenticated users to update posts"
ON public.blogs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 5: Allow authenticated users to delete posts
CREATE POLICY "Allow authenticated users to delete posts"
ON public.blogs
FOR DELETE
TO authenticated
USING (true);



