import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referredId, referralCode } = body;

    if (!referredId || !referralCode) {
      return NextResponse.json({ error: "Referred User ID and Referral Code are required." }, { status: 400 });
    }

    // 1. Find the referrer user using the referral code
    const { data: codeData, error: codeError } = await supabase
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
    const { data: existingRecord } = await supabase
      .from("referral_records")
      .select("id")
      .eq("referred_id", referredId)
      .maybeSingle();

    if (existingRecord) {
      return NextResponse.json({ error: "This user has already been referred." }, { status: 400 });
    }

    // 4. Create a pending referral record
    const { data: record, error: insertError } = await supabase
      .from("referral_records")
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        status: "pending",
        reward_status: "pending"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting referral record:", insertError);
      return NextResponse.json({ error: "Failed to register referral." }, { status: 500 });
    }

    return NextResponse.json({ success: true, record }, { status: 200 });

  } catch (error: any) {
    console.error("Referral Register API Error:", error);
    return NextResponse.json({ error: error.message || "Server error registering referral." }, { status: 500 });
  }
}
