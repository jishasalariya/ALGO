import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "@/lib/supabase";
import { validateCoupon } from "@/lib/coupons";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, items, couponCode, userId, currency = "INR" } = body;
    const receipt = `receipt_kyu_${Date.now()}`;

    console.log("Processing Razorpay order request:", { amount, couponCode, userId });

    // Verify keys
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === "test_key") {
      return NextResponse.json({ error: "Razorpay Key ID is missing or invalid in Environment Variables." }, { status: 500 });
    }
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === "test_secret") {
      return NextResponse.json({ error: "Razorpay Key Secret is missing or invalid in Environment Variables." }, { status: 500 });
    }

    let finalAmount = amount;

    // Secure server-side validation of amount if items are provided
    if (items && items.length > 0) {
      let subtotal = 0;
      for (const item of items) {
        const { data: product, error: prodError } = await supabase
          .from("products")
          .select("price")
          .eq("id", item.productId)
          .single();

        if (prodError || !product) {
          return NextResponse.json(
            { error: `Product not found or price mismatch: ${item.name}` },
            { status: 400 }
          );
        }
        subtotal += product.price * item.quantity;
      }

      // Calculate shipping
      const totalQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      const shippingCharge = totalQuantity >= 2 ? 0 : 50;

      // Validate and compute coupon discount
      let discount = 0;
      if (couponCode) {
        const validation = await validateCoupon(couponCode, subtotal, userId);
        if (validation.isValid) {
          discount = validation.discount;
        } else {
          return NextResponse.json({ error: validation.message }, { status: 400 });
        }
      }

      finalAmount = Math.max(0, subtotal - discount + shippingCharge);
    }

    const amountInPaise = Math.round(finalAmount * 100);

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json({ error: "Invalid payment amount: " + finalAmount }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create order",
        description: error.description || "Check your Razorpay dashboard for errors.",
      },
      { status: 500 }
    );
  }
}
