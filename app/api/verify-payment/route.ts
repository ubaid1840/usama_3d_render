import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { payment_intent } = await req.json();

  const intent = await stripe.paymentIntents.retrieve(payment_intent);

  console.log("Verified payment:", intent);

  return NextResponse.json({
    verified: intent.status === "succeeded",
    status: intent.status,
    amount: intent.amount,
    currency: intent.currency,
  });
}