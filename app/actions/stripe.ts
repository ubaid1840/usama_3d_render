'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

export async function createCheckoutSession(productId: string, userData: {
  name: string
  email: string
  phone: string
}) {
  // Validate product exists and get price
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error('Product not found')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment`,
      customer_email: userData.email,
      metadata: {
        customerName: userData.name,
        customerEmail: userData.email,
        customerPhone: userData.phone,
      },
    })

    return { clientSecret: session.client_secret, sessionId: session.id }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
