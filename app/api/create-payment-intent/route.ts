import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  console.log("User info before payment:", body);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 12500,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      name: body.name,
      email: body.email,
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}