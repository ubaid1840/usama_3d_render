import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, message: 'Payment Intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the payment intent from Stripe to verify payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, message: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Extract customer information from payment intent metadata
    const charge = paymentIntent.charges.data[0]
    const billingDetails = charge?.billing_details

    // Log the payment information to console
    console.log('[Payment Verified Successfully]', {
      timestamp: new Date().toISOString(),
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      billingDetails: billingDetails,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        data: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          customerInfo: {
            name: billingDetails?.name || 'N/A',
            email: billingDetails?.email || 'N/A',
            phone: billingDetails?.phone || 'N/A',
            address: billingDetails?.address?.line1 || 'N/A',
            city: billingDetails?.address?.city || 'N/A',
            state: billingDetails?.address?.state || 'N/A',
            zipCode: billingDetails?.address?.postal_code || 'N/A',
            country: billingDetails?.address?.country || 'N/A',
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Payment Verification Error]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error verifying payment',
      },
      { status: 500 }
    )
  }
}
