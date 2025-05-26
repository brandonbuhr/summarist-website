import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      console.warn("⚠️ Missing userId in request body");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const firebaseUser = await admin.auth().getUser(userId);
    const email = firebaseUser.email;

    if (!email) {
      console.warn("⚠️ Email not found for Firebase user");
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        uid: userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/choose-plan`,
    });

    console.log("✅ Created Stripe checkout session:", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe checkout session creation failed:", err.message);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
