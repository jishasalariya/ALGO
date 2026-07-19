"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Lock, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, totalAmount, shippingCharge, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    paymentMethod: "razorpay"
  });

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Available Checkout Coupons States
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const fetchAvailableCoupons = async (token: string) => {
    setLoadingCoupons(true);
    try {
      const res = await fetch(`/api/coupons/user`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data && data.coupons) {
        // Only show active coupons
        const active = data.coupons.filter((c: any) => c.status === "active");
        setAvailableCoupons(active);
      }
    } catch (err) {
      console.error("Error fetching checkout coupons:", err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login";
      } else {
        setUserId(session.user.id);
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
        fetchAvailableCoupons(session.access_token);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live total calculations
  const discount = discountAmount;
  const finalTotal = Math.max(0, totalAmount - discount + shippingCharge);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = typeof codeToApply === "string" ? codeToApply : couponCode;
    if (!code.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({
          code: code.trim(),
          subtotal: totalAmount,
          userId: session?.user?.id || userId
        })
      });

      const data = await res.json();
      if (data.isValid) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discount);
        setCouponSuccess(data.message || `Coupon "${data.coupon.code}" applied successfully!`);
      } else {
        setCouponError(data.message || "Failed to validate coupon.");
      }
    } catch (err) {
      console.error("Error applying coupon:", err);
      setCouponError("An error occurred. Please try again.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (formData.paymentMethod === "razorpay") {
      try {
        console.log("Starting Razorpay checkout for amount:", finalTotal);
        
        if (!(window as any).Razorpay) {
          alert("Payment gateway is still loading. Please wait a moment and try again.");
          return;
        }

        // Call Razorpay API to create the Razorpay Order with verified server amount
        const response = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: finalTotal,
            items,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            userId
          }),
        });
        
        const order = await response.json();
        
        if (order.error) {
          console.error("Order creation failed:", order.error);
          alert(`Error creating order: ${order.error} ${order.description ? `(${order.description})` : ''}`);
          return;
        }

        setLoading(true);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: order.amount,
          currency: order.currency,
          name: "KYU?",
          description: "Premium Streetwear Order",
          order_id: order.id,
          handler: async function (paymentResponse: any) {
            console.log("Payment success, ID:", paymentResponse.razorpay_payment_id);
            setLoading(true);

            try {
              // Securely save order details server-side
              const { data: { session } } = await supabase.auth.getSession();
              const placeOrderRes = await fetch("/api/checkout/place-order", {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${session?.access_token || ""}`
                },
                body: JSON.stringify({
                  items,
                  formData,
                  paymentMethod: "razorpay",
                  couponCode: appliedCoupon ? appliedCoupon.code : null,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpaySignature: paymentResponse.razorpay_signature
                })
              });

              const placeOrderResult = await placeOrderRes.json();
              if (placeOrderRes.status === 401) {
                alert("Your session has expired. Please log in again to complete your order.");
                window.location.href = "/login";
                return;
              }
              if (placeOrderResult.error) {
                alert("Error recording order details: " + placeOrderResult.error);
                setLoading(false);
                return;
              }

              // Send confirmation email
              try {
                const productNames = items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(', ');
                const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
                
                await fetch("/api/email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: formData.email,
                    orderId: paymentResponse.razorpay_payment_id,
                    amount: finalTotal,
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                    address: fullAddress,
                    products: productNames
                  })
                });
              } catch (e) {
                console.error("Failed to send email");
              }

              clearCart();
              window.location.href = "/account";
            } catch (err: any) {
              console.error("Error creating order after payment:", err);
              alert("Payment was successful but we failed to record your order. Please contact support with Payment ID: " + paymentResponse.razorpay_payment_id);
              setLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              console.log("Checkout modal closed");
            }
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (paymentResponse: any){
          console.error("Payment failed:", paymentResponse.error);
          alert("Payment Failed: " + paymentResponse.error.description);
          setLoading(false);
        });
        rzp1.open();
      } catch (error: any) {
        console.error("Razorpay Error:", error);
        alert("Failed to initialize payment: " + (error.message || "Unknown error"));
        setLoading(false);
      }
    } else {
      // Cash on Delivery
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const placeOrderRes = await fetch("/api/checkout/place-order", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token || ""}`
          },
          body: JSON.stringify({
            items,
            formData,
            paymentMethod: "cod",
            couponCode: appliedCoupon ? appliedCoupon.code : null
          })
        });

        const placeOrderResult = await placeOrderRes.json();
        if (placeOrderRes.status === 401) {
          alert("Your session has expired. Please log in again to complete your order.");
          window.location.href = "/login";
          return;
        }
        if (placeOrderResult.error) {
          alert("Error placing order: " + placeOrderResult.error);
          setLoading(false);
          return;
        }

        setLoading(false);
        alert("Order placed successfully via COD!");
        
        // Send confirmation email
        try {
          const productNames = items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(', ');
          const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

          await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              orderId: placeOrderResult.orderId,
              amount: finalTotal,
              customerName: `${formData.firstName} ${formData.lastName}`,
              phone: formData.phone,
              address: fullAddress,
              products: productNames
            })
          });
        } catch (e) {
          console.error("Failed to send email");
        }

        clearCart();
        window.location.href = "/account";
      } catch (err: any) {
        console.error("COD place order error:", err);
        alert("Failed to place order. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 selection:bg-white selection:text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400">
          <Lock className="w-4 h-4" /> Secure Checkout
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Checkout Form */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <div className="mb-8 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link>
              <span className="text-gray-600">/</span>
              <span className="text-white">Checkout</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-12">
              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-bold tracking-tighter uppercase mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Email address" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="Phone number" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-bold tracking-tighter uppercase mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    placeholder="First name" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    placeholder="Last name" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder="Address" 
                    value={formData.address}
                    onChange={handleChange}
                    className="col-span-2 w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="text" 
                    name="city"
                    required
                    placeholder="City" 
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="text" 
                    name="state"
                    required
                    placeholder="State" 
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                  <input 
                    type="text" 
                    name="pincode"
                    required
                    placeholder="PIN Code" 
                    value={formData.pincode}
                    onChange={handleChange}
                    className="col-span-2 w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-xl font-bold tracking-tighter uppercase mb-6">Payment</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-white/20 rounded-lg cursor-pointer hover:border-white transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="razorpay" 
                        checked={formData.paymentMethod === "razorpay"}
                        onChange={handleChange}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="font-medium">UPI / Card / Netbanking</span>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 brightness-0 invert" />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-white/20 rounded-lg cursor-pointer hover:border-white transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full flex justify-center items-center gap-3 bg-white text-black py-5 rounded-lg uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Pay ₹${finalTotal}`}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 lg:sticky lg:top-32">
              <h2 className="text-xl font-bold tracking-tighter uppercase mb-6 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-[#111] border border-white/10 flex-shrink-0 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-0 md:grayscale" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-medium uppercase tracking-wider text-sm">{item.name}</h3>
                        <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Size: {item.size}</p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Have a Coupon? Section */}
              <div className="border-t border-white/10 pt-6 pb-6">
                <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-gray-400">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Have a Coupon?</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="ENTER COUPON CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={appliedCoupon !== null || validatingCoupon}
                    className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white text-xs uppercase tracking-widest focus:outline-none focus:border-white disabled:opacity-50 transition-colors"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="bg-white text-black px-6 rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {validatingCoupon ? "..." : "Apply"}
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-red-400 text-xs mt-2 font-mono uppercase tracking-wider">
                    {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-green-400 text-xs mt-2 font-mono uppercase tracking-wider">
                    {couponSuccess}
                  </p>
                )}

                {/* Available Coupons list */}
                {userId && availableCoupons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                      Available Coupons (Click to apply)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableCoupons.map((coupon) => (
                        <button
                          key={coupon.id}
                          type="button"
                          disabled={appliedCoupon !== null || validatingCoupon}
                          onClick={() => {
                            setCouponCode(coupon.code);
                            // Auto apply
                            setTimeout(() => {
                              handleApplyCoupon(coupon.code);
                            }, 50);
                          }}
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white text-gray-400 hover:text-black border border-white/10 hover:border-white rounded text-[10px] font-mono uppercase tracking-widest transition-all text-left flex flex-col gap-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <span className="font-bold text-inherit">{coupon.code}</span>
                          <span className="text-[8px] opacity-70 text-inherit">
                            {coupon.discount_type === "percentage" ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400 text-sm font-mono uppercase tracking-wider">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? <span className="text-green-400">FREE</span> : `₹${shippingCharge}`}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-white font-medium text-xl">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
