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
