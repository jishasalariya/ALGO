import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
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

    // Email to Store Owner
    const ownerMailOptions = {
      from: `"KYU? Contact Form" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `NEW CONTACT MESSAGE: ${subject.toUpperCase()} - ${name}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; background-color: #000; color: #fff;">
          <h2 style="color: #fff; border-bottom: 2px solid #fff; padding-bottom: 10px; text-transform: uppercase; text-align: center;">KYU?</h2>
          <h3 style="color: #aaa; text-align: center; margin-top: 0;">New Contact Submission</h3>
          
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #ffffff; text-decoration: underline;">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            
            <h4 style="margin-top: 25px; border-bottom: 1px solid #333; padding-bottom: 5px; text-transform: uppercase; color: #888;">Message:</h4>
            <div style="background-color: #111; padding: 20px; border-radius: 5px; border: 1px solid #333; white-space: pre-wrap; line-height: 1.6; color: #ccc; font-size: 15px;">${message}</div>
          </div>
          
          <p style="font-size: 11px; color: #555; margin-top: 40px; border-top: 1px solid #222; padding-top: 15px; text-align: center; letter-spacing: 1px;">
            "LIFE RUNS ON BAD DECISIONS & BROKEN ALGORITHMS"
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(ownerMailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Contact Form Email Error:', error);
    return NextResponse.json(
      { error: 'Failed to send contact email' },
      { status: 500 }
    );
  }
}
