import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { validateCoupon } from "@/lib/coupons";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Verify access token from client headers (prevent IDOR)
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

    const body = await request.json();
    const { 
      items, 
      formData, 
      paymentMethod, 
      couponCode, 
      razorpayPaymentId, 
      razorpayOrderId, 
      razorpaySignature
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // 2. Recalculate order subtotal by fetching actual prices from DB to prevent client-side price tampering
    let subtotal = 0;
    const productPriceMap: Record<string, number> = {};

    for (const item of items) {
      const { data: product, error: prodError } = await supabaseAdmin
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
      
      const dbPrice = Number(product.price);
      productPriceMap[item.productId] = dbPrice;
      subtotal += dbPrice * item.quantity;
    }

    // 3. Validate coupon if provided using admin client to bypass select RLS checks
    let discount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      const validation = await validateCoupon(couponCode, subtotal, userId, supabaseAdmin);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.message }, { status: 400 });
      }
      discount = validation.discount;
      validatedCoupon = validation.coupon;
    }

    // 4. Calculate shipping charge
    // Rule: Free if total items quantity >= 2, else ₹50
    const totalQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const shippingCharge = totalQuantity >= 2 ? 0 : 50;

    const grandTotal = Math.max(0, subtotal - discount + shippingCharge);

    // 5. Razorpay Secure Payment Verification (Signature Verification)
    let paymentStatus = "pending";
    let orderId = `COD-${Math.floor(Math.random() * 900000) + 100000}`;

    if (paymentMethod === "razorpay") {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return NextResponse.json(
          { error: "Missing Razorpay payment validation credentials." },
          { status: 400 }
        );
      }

      // Perform backend HMAC SHA256 verification using Razorpay Secret Key
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json(
          { error: "Payment verification failed: Razorpay secret is not configured on the server." },
          { status: 500 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { error: "Payment verification failed: Invalid Razorpay signature signature mismatch." },
          { status: 400 }
        );
      }

      orderId = razorpayPaymentId;
      paymentStatus = "completed";
    }

    // 6. Save Address
    const { error: addressError } = await supabaseAdmin.from("addresses").insert({
      user_id: userId,
      full_name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      pincode: formData.pincode,
      city: formData.city,
      state: formData.state,
      address_line: formData.address,
    });

    if (addressError) {
      return NextResponse.json({ error: "Failed to save shipping address: " + addressError.message }, { status: 500 });
    }

    // 7. Save Order (using elevated admin role to bypass order insert constraints securely)
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        order_id: orderId,
        total_amount: grandTotal,
        shipping_charge: shippingCharge,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        order_status: "processing",
        shipping_address: formData,
        coupon_code: validatedCoupon ? validatedCoupon.code : null,
        discount_amount: discount,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { error: "Failed to create order in database: " + (orderError?.message || "Unknown error") },
        { status: 500 }
      );
    }

    // 8. Save Order Items (using verified database prices from recalculated pricing map)
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.productId,
      quantity: item.quantity,
      selected_size: item.size,
      price: productPriceMap[item.productId], // Securely bind the database price
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);
    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", orderData.id);
      return NextResponse.json({ error: "Failed to save order items: " + itemsError.message }, { status: 500 });
    }

    // 9. Reduce Stock Quantity
    for (const item of items) {
      const { data: productData } = await supabaseAdmin
        .from("products")
        .select("stock_quantity")
        .eq("id", item.productId)
        .single();

      if (productData) {
        const newStock = Math.max(0, (productData.stock_quantity || 0) - item.quantity);
        await supabaseAdmin
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", item.productId);
      }
    }

    // 10. Increment Coupon usage count & record usage details
    if (validatedCoupon && !validatedCoupon.isReferral) {
      const { error: updateCouponError } = await supabaseAdmin
        .from("coupons")
        .update({ times_used: (validatedCoupon.times_used || 0) + 1 })
        .eq("id", validatedCoupon.id);
      if (updateCouponError) {
        console.error("Failed to increment coupon uses:", updateCouponError.message);
      }

      // Record in coupon_usage_history
      await supabaseAdmin.from("coupon_usage_history").insert({
        user_id: userId,
        coupon_id: validatedCoupon.id,
        order_id: orderData.order_id,
        discount_amount: discount
      });

      // Update user_coupons status
      await supabaseAdmin
        .from("user_coupons")
        .update({ status: "used", redeemed_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("coupon_id", validatedCoupon.id);
    }

    // 11. Check Referral Reward Logic
    try {
      if (validatedCoupon && validatedCoupon.isReferral) {
        const { data: codeData } = await supabaseAdmin
          .from("referral_codes")
          .select("user_id")
          .eq("code", couponCode.trim().toUpperCase())
          .maybeSingle();

        if (codeData) {
          const referrerId = codeData.user_id;
          if (referrerId !== userId) {
            const { data: existingRec } = await supabaseAdmin
              .from("referral_records")
              .select("id")
              .eq("referred_id", userId)
              .maybeSingle();

            if (!existingRec) {
              // Generate unique reward coupon code for the referrer
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

              if (couponInsertError) {
                console.error("Failed to create reward coupon:", couponInsertError.message);
              } else if (newCoupon) {
                const { error: assignError } = await supabaseAdmin
                  .from("user_coupons")
                  .insert({
                    user_id: referrerId,
                    coupon_id: newCoupon.id,
                    status: "active"
                  });

                if (assignError) {
                  console.error("Failed to assign reward coupon to referrer:", assignError.message);
                } else {
                  // Create successful and rewarded referral record directly
                  await supabaseAdmin
                    .from("referral_records")
                    .insert({
                      referrer_id: referrerId,
                      referred_id: userId,
                      status: "successful",
                      reward_status: "rewarded"
                    });
                }
              }
            }
          }
        }
      }
    } catch (refErr) {
      console.error("Failed to process referral rewards:", refErr);
    }

    return NextResponse.json(
      { success: true, orderId: orderData.order_id, amount: grandTotal },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Server Order Placement Error:", error);
    return NextResponse.json({ error: error.message || "Server error placing order." }, { status: 500 });
  }
}
