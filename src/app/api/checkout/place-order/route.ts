import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, formData, paymentMethod, couponCode, razorpayPaymentId, razorpayOrderId, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // 1. Recalculate order subtotal by fetching actual prices from DB to prevent client-side price tampering
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

    // 2. Validate coupon if provided
    let discount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      const validation = await validateCoupon(couponCode, subtotal, userId);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.message }, { status: 400 });
      }
      discount = validation.discount;
      validatedCoupon = validation.coupon;
    }

    // 3. Calculate shipping charge
    // Rule: Free if total items quantity >= 2, else ₹50
    const totalQuantity = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const shippingCharge = totalQuantity >= 2 ? 0 : 50;

    const grandTotal = Math.max(0, subtotal - discount + shippingCharge);

    // 4. Save Address
    const { error: addressError } = await supabase.from("addresses").insert({
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

    // 5. Determine order status details
    const orderId = paymentMethod === "razorpay" ? razorpayPaymentId : `COD-${Math.floor(Math.random() * 900000) + 100000}`;
    const paymentStatus = paymentMethod === "razorpay" ? "completed" : "pending";

    // 6. Save Order (using standard client access)
    const { data: orderData, error: orderError } = await supabase
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

    // 7. Save Order Items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.productId,
      quantity: item.quantity,
      selected_size: item.size,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      // Revert/delete order to avoid orphan records if possible
      await supabase.from("orders").delete().eq("id", orderData.id);
      return NextResponse.json({ error: "Failed to save order items: " + itemsError.message }, { status: 500 });
    }

    // 8. Reduce Stock Quantity
    for (const item of items) {
      const { data: productData } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.productId)
        .single();

      if (productData) {
        const newStock = Math.max(0, (productData.stock_quantity || 0) - item.quantity);
        await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", item.productId);
      }
    }

    // 9. Increment Coupon usage count
    if (validatedCoupon) {
      const { error: updateCouponError } = await supabase
        .from("coupons")
        .update({ times_used: (validatedCoupon.times_used || 0) + 1 })
        .eq("id", validatedCoupon.id);
      if (updateCouponError) {
        console.error("Failed to increment coupon uses:", updateCouponError.message);
      }
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
