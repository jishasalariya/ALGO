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
    const { amount, currency = "INR" } = body;
    const receipt = `receipt_algo_${Date.now()}`;
    
    console.log("Processing Razorpay order:", { amount, currency, receipt });

    // Verify keys
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'test_key') {
      return NextResponse.json({ error: "Razorpay Key ID is missing or invalid in Vercel Environment Variables." }, { status: 500 });
    }
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'test_secret') {
      return NextResponse.json({ error: "Razorpay Key Secret is missing or invalid in Vercel Environment Variables." }, { status: 500 });
    }

    const amountInPaise = Math.round(amount * 100);

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json({ error: "Invalid payment amount: " + amount }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to create order",
        description: error.description || "Check your Razorpay dashboard for errors."
      }, 
      { status: 500 }
    );
  }
}
