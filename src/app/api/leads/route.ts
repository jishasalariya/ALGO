import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // 1. Validation & Sanitization
    const sanitizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const sanitizedPhone = typeof phone === "string" ? phone.trim() : "";
    const sanitizedName = typeof name === "string" ? name.trim() : "";

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;

    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Phone is required
    if (!sanitizedPhone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(sanitizedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (10-15 digits, digits only, space or dash, optional prefix +)." },
        { status: 400 }
      );
    }

    // 2. Database Insert
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: sanitizedName || null,
        email: sanitizedEmail,
        phone: sanitizedPhone,
      })
      .select();

    // 3. Error Handling
    if (error) {
      console.error("Database error inserting lead:", error);

      // Check for unique key constraint violation (Postgres error code 23505)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email or phone number is already registered for early access." },
          { status: 409 } // 409 Conflict
        );
      }

      return NextResponse.json(
        { error: "Failed to store early access submission. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully signed up for early access!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API error inserting lead:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
