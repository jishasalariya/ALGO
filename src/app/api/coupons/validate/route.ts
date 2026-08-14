import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal, userId } = body;

    if (!code) {
      return NextResponse.json(
        { isValid: false, message: "Coupon code is required.", discount: 0 },
        { status: 400 }
      );
    }

    if (subtotal === undefined || typeof subtotal !== "number" || subtotal < 0) {
      return NextResponse.json(
        { isValid: false, message: "Invalid or missing order subtotal.", discount: 0 },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, subtotal, userId, supabaseAdmin);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Coupon Validation API Error:", error);
    return NextResponse.json(
      { isValid: false, message: error.message || "Server error validating coupon.", discount: 0 },
      { status: 500 }
    );
  }
}
