'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

interface PaymentData {
  paymentIntentId: string
  amount: number
  currency: string
  status: string
  customerInfo?: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent_id')
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentIntentId) {
        setError('No payment ID found')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentIntentId }),
        })

        const result = await response.json()

        if (result.success) {
          setPaymentData(result.data)
          console.log('[Payment Verified]', result.data)
        } else {
          setError(result.message || 'Payment verification failed')
        }
      } catch (err) {
        console.error('Error verifying payment:', err)
        setError('Error verifying payment')
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [paymentIntentId])

  return (
    <>
      <Particles />
      <Navbar centerText="PAYMENT SUCCESSFUL" showFullNav={false} />

      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="glass p-8 rounded-lg shadow-2xl">
            {isLoading ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-200">
                  Verifying your payment...
                </p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="mb-6">
                  <svg
                    className="w-20 h-20 mx-auto text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-red-500">
                  Payment Error
                </h1>
                <p className="text-gray-400 mb-8 text-lg">{error}</p>
                <Link
                  href="/payment"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
                >
                  Try Again
                </Link>
              </div>
            ) : paymentData ? (
              <div className="text-center">
                <div className="mb-8">
                  <svg
                    className="w-20 h-20 mx-auto text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h1 className="text-5xl font-bold text-green-500 mb-2">
                    Payment Successful!
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Your payment has been processed securely
                  </p>
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-700/30 p-6 rounded-lg mb-8 text-left">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-2xl font-bold text-blue-400">
                        ${(paymentData.amount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Currency</p>
                      <p className="text-2xl font-bold text-gray-200">
                        {paymentData.currency.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payment ID</p>
                    <p className="text-sm font-mono text-gray-300 break-all">
                      {paymentData.paymentIntentId}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                {paymentData.customerInfo && (
                  <div className="bg-gray-800/50 border border-gray-700/30 p-6 rounded-lg mb-8 text-left">
                    <h2 className="text-xl font-bold mb-4 text-center">
                      Customer Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-gray-200 font-semibold">
                          {paymentData.customerInfo.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-gray-200 font-semibold">
                          {paymentData.customerInfo.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-gray-200 font-semibold">
                          {paymentData.customerInfo.phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Country</p>
                        <p className="text-gray-200 font-semibold">
                          {paymentData.customerInfo.country}
                        </p>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">
                        Billing Address
                      </p>
                      <p className="text-gray-200 font-semibold">
                        {paymentData.customerInfo.address}
                      </p>
                      <p className="text-gray-200 font-semibold">
                        {paymentData.customerInfo.city}, {paymentData.customerInfo.state}{' '}
                        {paymentData.customerInfo.zipCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <p className="text-xs text-gray-500 mb-8">
                  Your payment information is secure and encrypted. A confirmation
                  email has been sent to your inbox.
                </p>

                {/* Action Button */}
                <Link
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
                >
                  Back to Home
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <Footer minimal />
    </>
  )
}

