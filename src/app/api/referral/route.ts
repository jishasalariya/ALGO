import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // 1. Get or generate referral code
    let { data: referralCodeData, error: fetchError } = await supabase
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
        const { data: existingCode } = await supabase
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
      // Use origin or default domain
      const origin = request.headers.get("origin") || "https://algo-streetwear.vercel.app";
      const referralLink = `${origin}/signup?ref=${uniqueCode}`;

      const { data: newCodeData, error: insertError } = await supabase
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

    // 2. Fetch referral statistics & history
    // Get all records where referrer_id = userId
    const { data: records, error: recordsError } = await supabase
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
    const { data: rewardCoupons, error: couponError } = await supabase
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
        status: record.status // 'pending' | 'successful' | 'rewarded' | 'rejected'
      };
    });

    return NextResponse.json({
      referralCode: referralCodeData.code,
      referralLink: referralCodeData.link,
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
