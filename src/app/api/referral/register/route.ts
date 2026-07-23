import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized. Missing or invalid Authorization header." }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Session has expired or is invalid." }, { status: 401 });
    }
    const referredId = user.id;

    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode) {
      return NextResponse.json({ error: "Referral Code is required." }, { status: 400 });
    }

    // 1. Find the referrer user using the referral code
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from("referral_codes")
      .select("user_id")
      .eq("code", referralCode.trim().toUpperCase())
      .maybeSingle();

    if (codeError || !codeData) {
      console.warn(`Referral code "${referralCode}" not found or error:`, codeError);
      return NextResponse.json({ error: "Invalid referral code." }, { status: 400 });
    }

    const referrerId = codeData.user_id;

    // 2. Prevent self-referrals
    if (referrerId === referredId) {
      return NextResponse.json({ error: "Self-referrals are not allowed." }, { status: 400 });
    }

    // 3. Prevent duplicate referrals (check if the referred user is already referred)
    const { data: existingRecord } = await supabaseAdmin
      .from("referral_records")
      .select("id")
      .eq("referred_id", referredId)
      .maybeSingle();

    if (existingRecord) {
      return NextResponse.json({ error: "This user has already been referred." }, { status: 400 });
    }

    // 4. Generate unique coupon code for referrer
    let uniqueRewardCode = "";
    let isUnique = false;
    let retries = 5;

    while (!isUnique && retries > 0) {
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      uniqueRewardCode = `REF-${randStr}`;

      const { data: existingCoupon } = await supabaseAdmin
        .from("coupons")
        .select("id")
        .eq("code", uniqueRewardCode)
        .maybeSingle();

      if (!existingCoupon) {
        isUnique = true;
      }
      retries--;
    }

    if (!isUnique) {
      uniqueRewardCode = `REF-${Date.now().toString().slice(-6)}`;
    }

    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + 30); 

    // 5. Create the coupon
    const { data: newCoupon, error: couponInsertError } = await supabaseAdmin
      .from("coupons")
      .insert({
        code: uniqueRewardCode,
        name: `Referral Reward`,
        discount_type: "percentage",
        discount_value: 20.00,
        min_order_value: 0.00,
        start_date: now.toISOString(),
        expiry_date: expiryDate.toISOString(),
        max_uses: 1,
        max_uses_per_customer: 1,
        is_active: true,
        description: `20% OFF Referral Reward Coupon.`
      })
      .select()
      .single();

    if (couponInsertError || !newCoupon) {
      console.error("Failed to create reward coupon:", couponInsertError);
      return NextResponse.json({ error: "Failed to generate reward coupon." }, { status: 500 });
    }

    // 6. Assign coupon to Referrer
    const { error: assignError } = await supabaseAdmin
      .from("user_coupons")
      .insert({
        user_id: referrerId,
        coupon_id: newCoupon.id,
        status: "active"
      });

    if (assignError) {
      console.error("Failed to assign reward coupon to referrer:", assignError);
      return NextResponse.json({ error: "Failed to assign reward coupon." }, { status: 500 });
    }

    // 7. Create a successful referral record directly using server admin client
    const { data: record, error: insertError } = await supabaseAdmin
      .from("referral_records")
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        status: "successful",
        reward_status: "rewarded"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting referral record:", insertError);
      return NextResponse.json({ error: "Failed to register referral." }, { status: 500 });
    }

    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch (error: any) {
    console.error("Referral registration server error:", error);
    return NextResponse.json({ error: error.message || "Failed to process referral registration." }, { status: 500 });
  }
}
