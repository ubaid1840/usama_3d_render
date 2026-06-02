'use client'

import { useEffect, useState } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface CheckoutProps {
  productId: string
  userData: {
    name: string
    email: string
    phone: string
  }
}

export function Checkout({ productId, userData }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')

  const handleCheckout = async () => {
    try {
      const result = await createCheckoutSession(productId, userData)
      setClientSecret(result.clientSecret || '')
      setSessionId(result.sessionId || '')
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to initiate checkout')
    }
  }

  // Send payment data to backend after session is created
  useEffect(() => {
    if (sessionId && clientSecret) {
      const sendPaymentData = async () => {
        try {
          const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              customerName: userData.name,
              customerEmail: userData.email,
              customerPhone: userData.phone,
            }),
          })

          if (response.ok) {
            console.log('[v0] Payment data sent to backend successfully')
          } else {
            console.error('[v0] Failed to send payment data:', response.statusText)
          }
        } catch (error) {
          console.error('[v0] Error sending payment data:', error)
        }
      }

      sendPaymentData()
    }
  }, [sessionId, clientSecret, userData])

  if (!clientSecret) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            <strong>Amount:</strong> $125.00
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Name:</strong> {userData.name}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> {userData.email}
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> {userData.phone}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Proceed to Payment
        </button>
      </div>
    )
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
