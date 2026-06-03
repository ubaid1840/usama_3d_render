import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const amount = Number(process.env.PRODUCT_AMOUNT || 12500)
    const body = await request.json()


    const verify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: body.captchaToken,
        },
      }
    );

    if (
      !verify.data.success ||
      verify.data.score < 0.5
    ) {
      return Response.json(
        {
          error: "Bot detection triggered",
        },
        {
          status: 400,
        }
      );
    }

    console.log('[Payment Intent Creation]', {
      timestamp: new Date().toISOString(),
      customerInfo: body,
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        address: body.address,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
    })

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Payment Intent Error]', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
