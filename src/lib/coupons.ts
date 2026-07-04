import { supabase } from "./supabase";

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  coupon?: any;
  discount: number;
}

export async function validateCoupon(
  code: string,
  subtotal: number,
  userId?: string | null
): Promise<CouponValidationResult> {
  if (!code) {
    return { isValid: false, message: "Coupon code is empty.", discount: 0 };
  }

  // Fetch coupon from Supabase
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (error || !coupon) {
    return { isValid: false, message: "Invalid coupon code.", discount: 0 };
  }

  // Check if coupon is active
  if (!coupon.is_active) {
    return { isValid: false, message: "This coupon is inactive.", discount: 0 };
  }

  // Check validity dates
  const now = new Date();
  const startDate = new Date(coupon.start_date);
  const expiryDate = new Date(coupon.expiry_date);

  if (now < startDate) {
    return { isValid: false, message: "This coupon is not active yet.", discount: 0 };
  }

  if (now > expiryDate) {
    return { isValid: false, message: "This coupon has expired.", discount: 0 };
  }

  // Check total usage limits
  if (coupon.times_used >= coupon.max_uses) {
    return { isValid: false, message: "This coupon usage limit has been reached.", discount: 0 };
  }

  // Check minimum order value
  if (subtotal < coupon.min_order_value) {
    return {
      isValid: false,
      message: `Minimum order value of ₹${coupon.min_order_value} is required to use this coupon.`,
      discount: 0,
    };
  }

  // Check usage per customer (only if customer limit is set and userId is provided)
  if (coupon.max_uses_per_customer && userId) {
    const { count, error: countError } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("coupon_code", coupon.code);

    if (!countError && count !== null && count >= coupon.max_uses_per_customer) {
      return {
        isValid: false,
        message: `You have already used this coupon the maximum allowed times (${coupon.max_uses_per_customer}).`,
        discount: 0,
      };
    }
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = subtotal * (Number(coupon.discount_value) / 100);
    // Cap discount if max_discount is defined
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = Number(coupon.max_discount);
    }
  } else if (coupon.discount_type === "fixed") {
    discount = Number(coupon.discount_value);
  }

  // Discount cannot be larger than the subtotal
  discount = Math.min(discount, subtotal);
  // Round to nearest integer or 2 decimals
  discount = Math.round(discount * 100) / 100;

  return {
    isValid: true,
    message: "Coupon applied successfully!",
    coupon,
    discount,
  };
}
