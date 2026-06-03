import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId, sessionId } = body

    if (paymentIntentId) {
      // Handle payment intent verification
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json(
          { success: false, message: 'Payment not succeeded' },
          { status: 400 }
        )
      }

      // Log the payment information to console
      console.log('[Payment Processed Successfully]', {
        timestamp: new Date().toISOString(),
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customer: paymentIntent.customer,
        metadata: paymentIntent.metadata,
      })

      console.log(
        `[Payment Success] Amount: $${(paymentIntent.amount / 100).toFixed(2)}`
      )
      console.log(`[Payment Success] Payment Intent ID: ${paymentIntent.id}`)
      console.log(`[Payment Success] Status: ${paymentIntent.status}`)

      return NextResponse.json(
        {
          success: true,
          message: 'Payment verified and processed',
          data: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
          },
        },
        { status: 200 }
      )
    }

    if (sessionId) {
      // Handle checkout session verification
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      // Check if payment was successful
      if (session.payment_status !== 'paid') {
        return NextResponse.json(
          { success: false, message: 'Payment not completed' },
          { status: 400 }
        )
      }

      // Extract customer information from session metadata
      const customerName = session.metadata?.customerName || 'N/A'
      const customerEmail =
        session.metadata?.customerEmail || session.customer_email || 'N/A'
      const customerPhone = session.metadata?.customerPhone || 'N/A'

      // Log the payment information to console
      console.log('[Payment Processed Successfully]', {
        timestamp: new Date().toISOString(),
        sessionId: session.id,
        paymentStatus: session.payment_status,
        paymentIntentId: session.payment_intent,
        customerName,
        customerEmail,
        customerPhone,
        amount: session.amount_total,
        currency: session.currency,
      })

      console.log(`[Payment Success] Customer Name: ${customerName}`)
      console.log(`[Payment Success] Customer Email: ${customerEmail}`)
      console.log(`[Payment Success] Customer Phone: ${customerPhone}`)
      console.log(`[Payment Success] Amount: $${(session.amount_total || 0) / 100}`)
      console.log(`[Payment Success] Session ID: ${session.id}`)

      return NextResponse.json(
        {
          success: true,
          message: 'Payment verified and processed',
          data: {
            sessionId: session.id,
            customerName,
            customerEmail,
            customerPhone,
            amount: session.amount_total,
          },
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'No payment ID provided' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Payment Error]', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing payment',
      },
      { status: 500 }
    )
  }
}


