import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const now = new Date().toISOString();

    // 1. Fetch coupons assigned to this user
    const { data: userCoupons, error: ucError } = await supabase
      .from("user_coupons")
      .select(`
        id,
        status,
        assigned_at,
        redeemed_at,
        coupons (*)
      `)
      .eq("user_id", userId);

    if (ucError) {
      console.error("Error fetching user coupons:", ucError);
      return NextResponse.json({ error: "Failed to fetch user coupons." }, { status: 500 });
    }

    // 2. Fetch all coupon IDs that are assigned to ANY user
    // This allows us to filter out private coupons from the global list
    const { data: allAssignedCoupons, error: acError } = await supabase
      .from("user_coupons")
      .select("coupon_id");

    if (acError) {
      console.error("Error fetching all assigned coupons:", acError);
      return NextResponse.json({ error: "Failed to fetch coupon assignments." }, { status: 500 });
    }

    const assignedIds = new Set((allAssignedCoupons || []).map(item => item.coupon_id));

    // 3. Fetch active global promotional coupons (not assigned to any user)
    const { data: activeCoupons, error: cError } = await supabase
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .gt("expiry_date", now);

    if (cError) {
      console.error("Error fetching active coupons:", cError);
      return NextResponse.json({ error: "Failed to fetch promotional coupons." }, { status: 500 });
    }

    const promotionalCoupons = (activeCoupons || [])
      .filter(coupon => !assignedIds.has(coupon.id))
      .map(coupon => ({
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        minOrderValue: coupon.min_order_value,
        expiryDate: coupon.expiry_date,
        description: coupon.description || "Promotional discount coupon",
        status: "active", // Global active coupons are always active for user display
        type: "promotional"
      }));

    // 4. Map user-specific coupons
    const rewardCoupons = (userCoupons || [])
      .map(uc => {
        const coupon: any = Array.isArray(uc.coupons) 
          ? uc.coupons[0] 
          : uc.coupons;

        if (!coupon) return null;

        const isExpired = new Date() > new Date(coupon.expiry_date);
        let status = uc.status; // 'active' | 'used' | 'expired'
        
        if (status === "active" && isExpired) {
          status = "expired";
        }

        return {
          id: coupon.id,
          userCouponId: uc.id,
          code: coupon.code,
          name: coupon.name,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          minOrderValue: coupon.min_order_value,
          expiryDate: coupon.expiry_date,
          description: coupon.description || "Referral reward discount coupon",
          status: status,
          type: "reward"
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    // Combine both lists
    const allCoupons = [...promotionalCoupons, ...rewardCoupons];

    return NextResponse.json({ coupons: allCoupons }, { status: 200 });

  } catch (error: any) {
    console.error("User Coupons API Error:", error);
    return NextResponse.json({ error: error.message || "Server error fetching user coupons." }, { status: 500 });
  }
}
