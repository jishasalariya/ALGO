import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt = "receipt_algo_1" } = body;
    console.log("Creating Razorpay order for amount:", amount);

    // Amount must be in paise (smallest currency unit). 
    // E.g., ₹100 becomes 10000 paise.
    const amountInPaise = Math.round(amount * 100);

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      console.error("Invalid amount provided:", amount);
      return NextResponse.json({ error: "Invalid amount: " + amount }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    console.log("Razorpay Options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order.id);

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error Details:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to create order",
        code: error.code,
        description: error.description
      }, 
      { status: 500 }
    );
  }
}
