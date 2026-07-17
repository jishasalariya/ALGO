"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type CartItem = {
  id: string; // unique string for the cart item (usually product.id + size)
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalAmount: number;
  shippingCharge: number;
  grandTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize and sync
  useEffect(() => {
    setIsClient(true);
    
    const initCart = async () => {
      let localItems: CartItem[] = [];
      const savedCart = localStorage.getItem("kyu_cart");
      if (savedCart) {
        try {
          localItems = JSON.parse(savedCart);
          setItems(localItems);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        
        // Fetch DB cart
        const { data: dbCart } = await supabase
          .from("cart")
          .select("*, products(product_name, price, images)")
          .eq("user_id", session.user.id);
          
        if (dbCart && dbCart.length > 0) {
          // Map DB cart to local CartItem structure
          const formattedDbItems: CartItem[] = dbCart.map((row: any) => ({
            id: `${row.product_id}-${row.selected_size}`,
            productId: row.product_id,
            name: row.products.product_name,
            price: row.products.price,
            size: row.selected_size,
            quantity: row.quantity,
            image: row.products.images?.[0] || ""
          }));

          // Merge local items that are not in DB yet (guest added items before login)
          const merged = [...formattedDbItems];
          let updatedDb = false;

          for (const local of localItems) {
            if (!merged.find(m => m.id === local.id)) {
              merged.push(local);
              updatedDb = true;
              await supabase.from('cart').insert({
                user_id: session.user.id,
                product_id: local.productId,
                quantity: local.quantity,
                selected_size: local.size
              });
            }
          }
          
          setItems(merged);
        } else if (localItems.length > 0) {
          // DB is empty, push local cart to DB
          const inserts = localItems.map(item => ({
            user_id: session.user.id,
            product_id: item.productId,
            quantity: item.quantity,
            selected_size: item.size
          }));
          await supabase.from('cart').insert(inserts);
        }
      }
    };
    
    initCart();
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("kyu_cart", JSON.stringify(items));
    }
  }, [items, isClient]);

  const addItem = async (newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...currentItems, newItem];
    });
    setIsCartOpen(true);

    if (userId) {
      const { data } = await supabase.from('cart').select('id, quantity').eq('user_id', userId).eq('product_id', newItem.productId).eq('selected_size', newItem.size).single();
      if (data) {
        await supabase.from('cart').update({ quantity: data.quantity + newItem.quantity }).eq('id', data.id);
      } else {
        await supabase.from('cart').insert({ user_id: userId, product_id: newItem.productId, quantity: newItem.quantity, selected_size: newItem.size });
      }
    }
  };

  const removeItem = async (id: string) => {
    const itemToRemove = items.find(i => i.id === id);
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    
    if (userId && itemToRemove) {
      await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', itemToRemove.productId).eq('selected_size', itemToRemove.size);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const itemToUpdate = items.find(i => i.id === id);
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (userId && itemToUpdate) {
      await supabase.from('cart').update({ quantity }).eq('user_id', userId).eq('product_id', itemToUpdate.productId).eq('selected_size', itemToUpdate.size);
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (userId) {
      await supabase.from('cart').delete().eq('user_id', userId);
    }
  };

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Shipping Rules: Flat ₹50. Free if they buy 2 or more t-shirts (for simplicity, >=2 items overall or total >= 5000)
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCharge = totalQuantity >= 2 ? 0 : 50; 
  
  const grandTotal = totalAmount + shippingCharge;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalAmount,
        shippingCharge,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
