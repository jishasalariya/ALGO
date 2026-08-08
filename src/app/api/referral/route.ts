import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(request: Request) {
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
    const userId = user.id;

    // 1. Get or generate referral code using admin client to read/write referral_codes safely
    let { data: referralCodeData, error: fetchError } = await supabaseAdmin
      .from("referral_codes")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching referral code:", fetchError);
    }

    if (!referralCodeData) {
      // Generate a unique referral code
      let uniqueCode = "";
      let isUnique = false;
      let retries = 5;

      while (!isUnique && retries > 0) {
        const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        uniqueCode = `KYU-${randStr}`;

        // Verify uniqueness
        const { data: existingCode } = await supabaseAdmin
          .from("referral_codes")
          .select("id")
          .eq("code", uniqueCode)
          .maybeSingle();

        if (!existingCode) {
          isUnique = true;
        }
        retries--;
      }

      if (!isUnique) {
        uniqueCode = `KYU-${Date.now().toString().slice(-6)}`;
      }

      // Generate the referral link
      const origin = request.headers.get("origin") || "https://kyuwear.vercel.app";
      const referralLink = `${origin}/signup?ref=${uniqueCode}`;

      const { data: newCodeData, error: insertError } = await supabaseAdmin
        .from("referral_codes")
        .insert({
          user_id: userId,
          code: uniqueCode,
          link: referralLink
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating referral code:", insertError);
        return NextResponse.json({ error: "Failed to generate referral code." }, { status: 500 });
      }

      referralCodeData = newCodeData;
    }

    // Ensure the link is using the current kyuwear.vercel.app domain
    const activeOrigin = "https://kyuwear.vercel.app";
    let referralLink = referralCodeData.link;
    if (referralLink && (referralLink.includes("algo-streetwear.vercel.app") || referralLink.includes("kyu-wear.vercel.app") || referralLink.includes("localhost"))) {
      referralLink = `${activeOrigin}/signup?ref=${referralCodeData.code}`;
      // Update in database asynchronously
      supabaseAdmin
        .from("referral_codes")
        .update({ link: referralLink })
        .eq("id", referralCodeData.id)
        .then(({ error }) => {
          if (error) console.error("Error updating referral link domain in DB:", error);
        });
    }

    // 2. Fetch referral statistics & history
    const { data: records, error: recordsError } = await supabaseAdmin
      .from("referral_records")
      .select(`
        id,
        referred_id,
        status,
        reward_status,
        created_at,
        referred_user:users!referred_id(full_name, email)
      `)
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (recordsError) {
      console.error("Error fetching referral records:", recordsError);
    }

    const referralRecords = records || [];

    // Calculate statistics
    const totalReferrals = referralRecords.length;
    const successfulReferrals = referralRecords.filter(r => r.status === "successful" || r.status === "rewarded").length;
    const pendingReferrals = referralRecords.filter(r => r.status === "pending").length;
    
    // Rewards earned: count reward coupons assigned to this user that have a description like "Referral Reward"
    const { data: rewardCoupons, error: couponError } = await supabaseAdmin
      .from("user_coupons")
      .select(`
        id,
        coupons!inner(code, name, discount_value)
      `)
      .eq("user_id", userId);

    if (couponError) {
      console.log("Error counting rewards:", couponError);
    }

    const rewardsEarned = rewardCoupons ? rewardCoupons.length : 0;

    // Map history to a clean structure
    const history = referralRecords.map((record: any) => {
      const friendUser = Array.isArray(record.referred_user) 
        ? record.referred_user[0] 
        : record.referred_user;
      
      return {
        id: record.id,
        friendName: friendUser?.full_name || friendUser?.email || "KYU Member",
        date: record.created_at,
        status: record.status
      };
    });

    return NextResponse.json({
      referralCode: referralCodeData.code,
      referralLink: referralLink,
      stats: {
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
        rewardsEarned
      },
      history
    }, { status: 200 });

  } catch (error: any) {
    console.error("Referral GET API Error:", error);
    return NextResponse.json({ error: error.message || "Server error fetching referral stats." }, { status: 500 });
  }
}
