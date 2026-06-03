import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[Payment Intent Creation]', {
      timestamp: new Date().toISOString(),
      customerInfo: body,
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 12500, // $125.00 in cents
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
