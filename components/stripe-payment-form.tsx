'use client'

import { useState } from 'react'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent } from '@/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

function StripePaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!stripe || !elements) {
      setError('Stripe is not loaded')
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent on the backend
      const { clientSecret } = await createPaymentIntent()

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {},
          },
        })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        setSuccessMessage(
          `Payment successful! Intent ID: ${paymentIntent.id}`
        )
        // Log to backend
        await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })
        elements.getElement(CardElement)?.clear()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-lg">
      <h1 className="text-4xl font-bold mb-2 text-center">Payment</h1>
      <p className="text-center text-gray-600 mb-8">
        N0Render Smart Box - $125.00
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border-2 border-gray-300 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
        >
          {isProcessing ? 'Processing...' : 'Pay $125.00'}
        </button>
      </form>
    </div>
  )
}

export function StripePaymentProvider() {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm />
    </Elements>
  )
}
