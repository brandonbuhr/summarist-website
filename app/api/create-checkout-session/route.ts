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
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const firebaseUser = await admin.auth().getUser(userId);
    const email = firebaseUser.email;

    if (!email) {
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/choose-plan`,
    });

    // Temporary front-end workaround: immediately set Premium status for demo/testing
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("subscription")
      .doc("status")
      .set({
        isActive: true,
        plan: "Premium",
        updatedAt: new Date().toISOString(),
      });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
