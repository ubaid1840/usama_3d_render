'use client'

import { useState, useEffect } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleCheckout = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await createCheckoutSession(productId, userData)
      if (result.clientSecret) {
        setClientSecret(result.clientSecret)
      } else {
        setError('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Failed to initiate checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="mb-6 space-y-2">
          <p className="text-gray-700">
            <strong>Product:</strong> N0Render Smart Box
          </p>
          <p className="text-gray-700">
            <strong>Amount:</strong> $125.00
          </p>
          <div className="border-t pt-3 mt-3">
            <p className="text-gray-700 mb-1">
              <strong>Name:</strong> {userData.name}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {userData.phone}
            </p>
          </div>
        </div>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
        >
          {isLoading ? 'Initializing...' : 'Proceed to Payment'}
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
