import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, message: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    console.log('[Payment Verification]', {
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    })

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed',
        },
        { status: 400 }
      )
    }

    // Return verified payment data
    return NextResponse.json(
      {
        success: true,
        data: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          customerInfo: paymentIntent.metadata,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Payment Verification Error]', error)
    return NextResponse.json(
      { success: false, message: 'Error verifying payment' },
      { status: 500 }
    )
  }
}
