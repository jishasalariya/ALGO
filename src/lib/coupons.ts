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
    // Check if it's a valid referral code instead
    const { data: referral, error: refError } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();

    if (refError || !referral) {
      return { isValid: false, message: "Invalid coupon code.", discount: 0 };
    }

    if (!userId) {
      return { isValid: false, message: "Please log in to apply a referral code.", discount: 0 };
    }

    // Prevent self-referral
    if (referral.user_id === userId) {
      return { isValid: false, message: "You cannot use your own referral code.", discount: 0 };
    }

    // Check if the user is a new customer (has ordered before)
    const { count: ordersCount } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (ordersCount && ordersCount > 0) {
      return { isValid: false, message: "Referral codes are only valid on your first order.", discount: 0 };
    }

    // Check if they already successfully used a referral
    const { data: existingRecord } = await supabase
      .from("referral_records")
      .select("status")
      .eq("referred_id", userId)
      .maybeSingle();

    if (existingRecord && (existingRecord.status === "successful" || existingRecord.status === "rewarded")) {
      return { isValid: false, message: "You have already completed a referral.", discount: 0 };
    }

    // Calculate a 10% discount for the referred customer
    const discountValue = 10.00; // 10% OFF
    const discount = Math.round(subtotal * (discountValue / 100) * 100) / 100;

    const mockCoupon = {
      id: referral.id,
      code: referral.code,
      name: "Referral Discount",
      discount_type: "percentage",
      discount_value: discountValue,
      min_order_value: 0.00,
      is_active: true,
      description: "10% OFF referral discount.",
      isReferral: true
    };

    return {
      isValid: true,
      message: "Referral code applied successfully!",
      coupon: mockCoupon,
      discount
    };
  }

  // Check if coupon is active
  if (!coupon.is_active) {
    return { isValid: false, message: "This coupon is inactive.", discount: 0 };
  }

  // Check if this is a user-specific coupon
  const { data: assignment } = await supabase
    .from("user_coupons")
    .select("*")
    .eq("coupon_id", coupon.id)
    .maybeSingle();

  if (assignment) {
    if (!userId) {
      return { isValid: false, message: "Please log in to use this coupon.", discount: 0 };
    }
    if (assignment.user_id !== userId) {
      return { isValid: false, message: "This coupon is not assigned to your account.", discount: 0 };
    }
    if (assignment.status !== "active") {
      return { isValid: false, message: `This coupon is already ${assignment.status}.`, discount: 0 };
    }
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
