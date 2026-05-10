"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, totalAmount, shippingCharge, grandTotal, clearCart } = useCart();
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/login";
      } else {
        setUserId(session.user.id);
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveToDatabase = async (orderId: string, method: string, pStatus: string) => {
    if (!userId) return;
    
    // Save Address
    await supabase.from('addresses').insert({
      user_id: userId,
      full_name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      pincode: formData.pincode,
      city: formData.city,
      state: formData.state,
      address_line: formData.address,
    });

    // Save Order
    const { data: orderData } = await supabase.from('orders').insert({
      user_id: userId,
      order_id: orderId,
      total_amount: grandTotal,
      shipping_charge: shippingCharge,
      payment_method: method,
      payment_status: pStatus,
      order_status: 'processing',
      shipping_address: formData
    }).select().single();

    // Save Order Items
    if (orderData) {
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        selected_size: item.size,
        price: item.price
      }));
      await supabase.from('order_items').insert(orderItems);

      // Reduce Stock Quantity
      for (const item of items) {
        const { data: productData } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.productId)
          .single();
          
        if (productData) {
          const newStock = Math.max(0, (productData.stock_quantity || 0) - item.quantity);
          await supabase
            .from('products')
            .update({ stock_quantity: newStock })
            .eq('id', item.productId);
        }
      }
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    if (formData.paymentMethod === "razorpay") {
      try {
        console.log("Starting Razorpay checkout for amount:", grandTotal);
        
        if (!(window as any).Razorpay) {
          alert("Payment gateway is still loading. Please wait a moment and try again.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal }),
        });
        
        const order = await response.json();
        
        if (order.error) {
          console.error("Order creation failed:", order.error);
          alert("Error creating order: " + order.error);
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Use a more obvious placeholder
          amount: order.amount,
          currency: order.currency,
          name: "ALGO",
          description: "Premium Streetwear Order",
          order_id: order.id,
          handler: async function (response: any) {
            console.log("Payment success, ID:", response.razorpay_payment_id);
            alert(`Payment successful!`);
            
            await saveToDatabase(response.razorpay_payment_id, 'razorpay', 'completed');
            
            // Send confirmation email
            try {
              const productNames = items.map(i => `${i.quantity}x ${i.name} (${i.size})`).join(', ');
              const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
              
              await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: formData.email,
                  orderId: response.razorpay_payment_id,
                  amount: grandTotal,
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
        rzp1.on('payment.failed', function (response: any){
          console.error("Payment failed:", response.error);
          alert("Payment Failed: " + response.error.description);
          setLoading(false);
        });
        rzp1.open();
      } catch (error: any) {
        console.error("Razorpay Error:", error);
        alert("Failed to initialize payment: " + (error.message || "Unknown error"));
      } finally {
        // We don't set loading to false here because rzp1.open() is async-like 
        // and we handle it in ondismiss or handler
      }
    } else {
      // Cash on Delivery
      const generatedOrderId = "COD-" + Math.floor(Math.random() * 100000);
      await saveToDatabase(generatedOrderId, 'cod', 'pending');

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
            orderId: generatedOrderId,
            amount: grandTotal,
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
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 selection:bg-white selection:text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
          ALGO
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
                {loading ? "Processing..." : `Pay ₹${grandTotal}`}
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
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
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

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? <span className="text-green-400">FREE</span> : `₹${shippingCharge}`}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-white font-medium text-xl">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
