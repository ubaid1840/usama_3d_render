import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the session from Stripe to verify payment
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
    const customerEmail = session.metadata?.customerEmail || session.customer_email || 'N/A'
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

    // Log each detail separately for clarity
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

