'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent } from '@/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

function PaymentDialog() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpenDialog = () => {
    setIsOpen(true)
    setError('')
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!stripe || !elements) {
      setError('Stripe is not loaded')
      return
    }

    // Validate form data
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.country
    ) {
      setError('Please fill in all required fields')
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
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: formData.country,
              },
            },
          },
        })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        // Log payment information to console
        console.log('[Payment Success]', {
          timestamp: new Date().toISOString(),
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            billingAddress: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
          },
        })

        console.log(`[Payment Success] Name: ${formData.name}`)
        console.log(`[Payment Success] Email: ${formData.email}`)
        console.log(`[Payment Success] Phone: ${formData.phone}`)
        console.log(`[Payment Success] Address: ${formData.address}`)
        console.log(`[Payment Success] City: ${formData.city}`)
        console.log(`[Payment Success] State: ${formData.state}`)
        console.log(`[Payment Success] Zip Code: ${formData.zipCode}`)
        console.log(`[Payment Success] Country: ${formData.country}`)
        console.log(`[Payment Success] Amount: $${(paymentIntent.amount / 100).toFixed(2)}`)
        console.log(`[Payment Success] Payment Intent ID: ${paymentIntent.id}`)

        // Send payment verification to backend
        await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            customerInfo: formData,
          }),
        })

        // Redirect to success page
        router.push(
          `/payment/success?payment_intent_id=${paymentIntent.id}`
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Order Summary Card */}
      <div className="glass p-8 rounded-lg shadow-lg text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Order Summary</h1>
        <div className="space-y-3 mb-8">
          <p className="text-lg">
            <span className="text-gray-400">Product:</span> N0Render Smart Box
          </p>
          <p className="text-lg">
            <span className="text-gray-400">Amount:</span>
            <span className="text-3xl font-bold text-blue-500 ml-2">
              $125.00
            </span>
          </p>
        </div>

        <button
          onClick={handleOpenDialog}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
        >
          Proceed to Payment
        </button>
      </div>

      {/* Payment Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Payment Details</h2>
              <button
                onClick={handleCloseDialog}
                disabled={isProcessing}
                className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Dialog Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Personal Information */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Billing Address */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Billing Address</h3>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    disabled={isProcessing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      disabled={isProcessing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      disabled={isProcessing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      disabled={isProcessing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

              {/* Card Element */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-semibold mb-2">
                  Card Information *
                </label>
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
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition text-lg mt-6"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Processing...
                  </span>
                ) : (
                  'Pay $125.00'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your payment information is secure and encrypted.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export function StripePaymentProvider() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentDialog />
    </Elements>
  )
}

