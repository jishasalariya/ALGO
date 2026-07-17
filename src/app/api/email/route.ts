import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, orderId, amount, customerName, phone, address, products } = await request.json();

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const ownerEmail = process.env.EMAIL_USER;

    // 1. Email to Customer
    const customerMailOptions = {
      from: `"KYU?" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmed: ${orderId}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000000; color: #ffffff;">
          <h1 style="text-transform: uppercase; letter-spacing: 2px; text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px;">KYU?</h1>
          
          <div style="margin-top: 30px;">
            <p style="font-size: 16px; color: #cccccc;">Hi ${customerName},</p>
            <p style="font-size: 16px; color: #cccccc;">Your order <strong>${orderId}</strong> has been successfully placed.</p>
            
            <div style="background-color: #111111; padding: 20px; margin-top: 30px; border: 1px solid #333;">
              <h3 style="text-transform: uppercase; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px;">Order Summary</h3>
              <p>Items: ${products || 'N/A'}</p>
              <p>Total Paid: <strong>₹${amount}</strong></p>
            </div>
            
            <p style="font-size: 14px; color: #888888; margin-top: 40px; text-align: center;">
              "Life runs on bad decisions & broken algorithms"
            </p>
          </div>
        </div>
      `,
    };

    // 2. Notification Email to Store Owner
    const ownerMailOptions = {
      from: `"KYU? System" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `NEW ORDER RECEIVED: ${orderId}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Order Alert!</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>
          
          <h3 style="margin-top: 20px;">Customer Details:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="padding: 5px 0;"><strong>Name:</strong> ${customerName}</li>
            <li style="padding: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
            <li style="padding: 5px 0;"><strong>Phone:</strong> ${phone || 'N/A'}</li>
            <li style="padding: 5px 0;"><strong>Shipping Address:</strong> ${address || 'N/A'}</li>
          </ul>

          <h3 style="margin-top: 20px;">Products Ordered:</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${products || 'N/A'}</p>
        </div>
      `,
    };

    // Send both emails simultaneously
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(ownerMailOptions)
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
