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

    // 4. Create a pending referral record using server admin client to bypass RLS restrictions
    const { data: record, error: insertError } = await supabaseAdmin
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
    console.error("Referral registration server error:", error);
    return NextResponse.json({ error: error.message || "Failed to process referral registration." }, { status: 500 });
  }
}
