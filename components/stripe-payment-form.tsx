'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

type FormData = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!stripe || !elements) {
      setError('Payment system not initialized')
      return
    }

    // Validate form
    if (!form.name || !form.email || !form.address || !form.city || !form.state || !form.postalCode) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Create payment intent
      const intentRes = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const intentData = await intentRes.json()

      if (!intentData.clientSecret) {
        setError('Failed to create payment session')
        setLoading(false)
        return
      }

      // Confirm payment
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              address: {
                line1: form.address,
                city: form.city,
                state: form.state,
                postal_code: form.postalCode,
                country: form.country,
              },
            },
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        setLoading(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        // Log payment info
        console.log('[Payment Success]', {
          timestamp: new Date().toISOString(),
          paymentIntentId: paymentIntent.id,
          customerInfo: form,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        })

        console.log(`[Payment] Name: ${form.name}`)
        console.log(`[Payment] Email: ${form.email}`)
        console.log(`[Payment] Phone: ${form.phone}`)
        console.log(`[Payment] Address: ${form.address}, ${form.city}, ${form.state} ${form.postalCode}`)
        console.log(`[Payment] Country: ${form.country}`)
        console.log(`[Payment] Intent ID: ${paymentIntent.id}`)

        // Send to backend
        await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            customerInfo: form,
          }),
        })

        // Redirect to success
        router.push(`/payment/success?payment_intent_id=${paymentIntent.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
        {/* Header */}
        <div className="mb-8 border-b pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-blue-600">$125</span>
              <span className="text-gray-500 ml-1">.00 USD</span>
            </div>
          </div>
          <p className="text-gray-600">N0Render Smart Box</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="New York"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="NY"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition"
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1f2937',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      '::placeholder': {
                        color: '#9ca3af',
                      },
                    },
                    invalid: {
                      color: '#ef4444',
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Secure card processing by Stripe
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !stripe || !elements}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                Processing Payment...
              </>
            ) : (
              'Pay $125.00'
            )}
          </button>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Your payment information is secure and encrypted. We never store your card details.
          </p>
        </form>
      </div>
    </div>
  )
}

export function StripePaymentProvider() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  )
}

