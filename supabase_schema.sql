-- ==========================================
-- ALGO Ecommerce Database Schema & Security
-- Run this entire script in your Supabase SQL Editor
-- ==========================================

-- 1. USERS TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE,
  profile_image TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically create a user profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 
    new.email, 
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent duplicate trigger errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  sizes TEXT[] DEFAULT '{}', -- Array of sizes like ['S', 'M', 'L', 'XL']
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  featured_product BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 3. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  pincode TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address_line TEXT NOT NULL,
  landmark TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id TEXT UNIQUE NOT NULL, -- e.g. ALGO-20231012-XYZ
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_charge DECIMAL(10, 2) DEFAULT 50.00,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'processing' CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL, -- Snapshot of address at the time of order
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selected_size TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL -- Price at the time of purchase
);


-- 6. CART TABLE
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  selected_size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, selected_size)
);


-- 7. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);


-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 9. OTP VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_or_phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 10. COUPONS TABLE
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
  is_visible BOOLEAN DEFAULT TRUE,
  description TEXT,
  times_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 11. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 12. REFERRAL CODES TABLE
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 13. REFERRAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.referral_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'rewarded', 'rejected')),
  reward_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (reward_status IN ('pending', 'rewarded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 14. USER COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  UNIQUE(user_id, coupon_id)
);


-- 15. COUPON USAGE HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.coupon_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  order_id VARCHAR(100) NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);


-- 16. BLOGS TABLE
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


-- =========================================================================
-- SECURITY POLICY CONFIGURATIONS (Row Level Security - RLS)
-- =========================================================================

-- Helper function to check if the requesting user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ----------------------------------------------------
-- A. USERS TABLE SECURITY
-- ----------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on users" ON public.users;
DROP POLICY IF EXISTS "Allow user update on self" ON public.users;
DROP POLICY IF EXISTS "Allow users to view own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admin view all profiles" ON public.users;
DROP POLICY IF EXISTS "Allow admin update all profiles" ON public.users;

-- Users can only read their own profile row, admins can read all
CREATE POLICY "Allow users to view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow admin view all profiles" ON public.users
  FOR SELECT TO authenticated USING (public.is_admin());

-- Users can update their own profile details, admins can update all
CREATE POLICY "Allow user update on self" ON public.users 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin update all profiles" ON public.users
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- B. PRODUCTS TABLE SECURITY
-- ----------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published products" ON public.products;
DROP POLICY IF EXISTS "Allow admin full access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public stock update" ON public.products;

CREATE POLICY "Public can view published products" ON public.products
  FOR SELECT USING (status = 'published');

-- Stock updates are done server-side via service role client (bypassing RLS). 
-- This keeps products write/update access restricted strictly to verified admins.
CREATE POLICY "Allow admin full access on products" ON public.products
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- C. BLOGS TABLE SECURITY
-- ----------------------------------------------------
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin full access on blogs" ON public.blogs;

CREATE POLICY "Allow public read access to published posts" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow admin full access on blogs" ON public.blogs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- D. CART & WISHLIST SECURITY
-- ----------------------------------------------------
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.cart;
CREATE POLICY "Users can manage their own cart" ON public.cart 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlist;
CREATE POLICY "Users can manage their own wishlist" ON public.wishlist 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ----------------------------------------------------
-- E. ADDRESSES & ORDERS SECURITY
-- ----------------------------------------------------
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
CREATE POLICY "Users can manage their own addresses" ON public.addresses 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);

-- Order creation is managed securely server-side via service role client (bypassing RLS).
-- Only authenticated admin users can modify or view all orders directly via database client.
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- F. ORDER_ITEMS SECURITY
-- ----------------------------------------------------
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

-- Users can view details of items in their own orders
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE public.orders.id = public.order_items.order_id 
      AND public.orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- G. PAYMENTS SECURITY
-- ----------------------------------------------------
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public insert on payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;

-- Users can view payment details linked to their own orders
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE public.orders.id = public.payments.order_id 
      AND public.orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- H. OTP VERIFICATION SECURITY
-- ----------------------------------------------------
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on otp" ON public.otp_verifications;
DROP POLICY IF EXISTS "Allow admin manage on otp" ON public.otp_verifications;

-- All OTP actions are strictly backend/admin-only (bypasses RLS). 
-- This completely blocks client-side public writes/reads to otp_verifications.
CREATE POLICY "Allow admin manage on otp" ON public.otp_verifications
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- I. LEADS SECURITY
-- ----------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow admin manage on leads" ON public.leads;

-- Lead insertions are processed securely server-side via api route. 
-- Public users have no direct insert or select privileges on this table.
CREATE POLICY "Allow admin manage on leads" ON public.leads 
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- J. COUPONS SECURITY
-- ----------------------------------------------------
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow admin manage on coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow public coupon update" ON public.coupons;

CREATE POLICY "Allow public select on coupons" ON public.coupons 
  FOR SELECT USING (is_active = true AND is_visible = true);

CREATE POLICY "Allow admin manage on coupons" ON public.coupons 
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- K. REFERRALS & USER COUPONS SECURITY
-- ----------------------------------------------------
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users manage own codes" ON public.referral_codes;
CREATE POLICY "Allow users manage own codes" ON public.referral_codes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.referral_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users select own referral records" ON public.referral_records;
DROP POLICY IF EXISTS "Allow public insert/update on referral_records" ON public.referral_records;
DROP POLICY IF EXISTS "Allow admin manage referral records" ON public.referral_records;

CREATE POLICY "Allow users select own referral records" ON public.referral_records
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Allow admin manage referral records" ON public.referral_records
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users select own assigned coupons" ON public.user_coupons;
DROP POLICY IF EXISTS "Allow public update on user_coupons" ON public.user_coupons;
DROP POLICY IF EXISTS "Allow admin manage user coupons" ON public.user_coupons;

CREATE POLICY "Allow users select own assigned coupons" ON public.user_coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow admin manage user coupons" ON public.user_coupons
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------
-- L. COUPON USAGE HISTORY SECURITY
-- ----------------------------------------------------
ALTER TABLE public.coupon_usage_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users select own coupon history" ON public.coupon_usage_history;
DROP POLICY IF EXISTS "Allow public insert on coupon_history" ON public.coupon_usage_history;
DROP POLICY IF EXISTS "Allow admin manage coupon history" ON public.coupon_usage_history;

CREATE POLICY "Allow users select own coupon history" ON public.coupon_usage_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow admin manage coupon history" ON public.coupon_usage_history
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
