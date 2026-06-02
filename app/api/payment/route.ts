import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { customerName, customerEmail, customerPhone, sessionId } = body

    // Console log the payment information
    console.log('[Payment Received]', {
      timestamp: new Date().toISOString(),
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
    })

    // Log each detail separately for clarity
    console.log(`Customer Name: ${customerName}`)
    console.log(`Customer Email: ${customerEmail}`)
    console.log(`Customer Phone: ${customerPhone}`)
    console.log(`Session ID: ${sessionId}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Payment information received and logged',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing payment',
      },
      { status: 500 }
    )
  }
}
