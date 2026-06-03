import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId, customerInfo } = body

    if (paymentIntentId && customerInfo) {
      // Log customer information when payment is made
      console.log('[Payment Transaction Initiated]', {
        timestamp: new Date().toISOString(),
        paymentIntentId,
        customerInfo,
      })

      console.log(`[Payment Transaction] Customer Name: ${customerInfo.name}`)
      console.log(`[Payment Transaction] Customer Email: ${customerInfo.email}`)
      console.log(`[Payment Transaction] Customer Phone: ${customerInfo.phone}`)
      console.log(`[Payment Transaction] Address: ${customerInfo.address}`)
      console.log(`[Payment Transaction] City: ${customerInfo.city}`)
      console.log(`[Payment Transaction] State: ${customerInfo.state}`)
      console.log(`[Payment Transaction] Zip Code: ${customerInfo.zipCode}`)
      console.log(`[Payment Transaction] Country: ${customerInfo.country}`)
      console.log(`[Payment Transaction] Payment Intent ID: ${paymentIntentId}`)

      return NextResponse.json(
        { success: true, message: 'Payment information logged' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request' },
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



