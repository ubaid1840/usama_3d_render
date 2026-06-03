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
    postalCode: string
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId }),
        })

        const result = await response.json()

        if (result.success && result.data) {
          setPaymentData(result.data)
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
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-700">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                </div>
                <p className="text-xl font-semibold text-slate-300">
                  Verifying your payment...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <svg
                  className="w-20 h-20 mx-auto text-red-500 mb-6"
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
                <h1 className="text-4xl font-bold text-red-500 mb-4">
                  Payment Error
                </h1>
                <p className="text-slate-400 mb-8 text-lg">{error}</p>
                <Link
                  href="/payment"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
                >
                  Try Again
                </Link>
              </div>
            ) : paymentData ? (
              <div className="text-center py-12">
                <svg
                  className="w-20 h-20 mx-auto text-green-500 mb-6"
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
                <p className="text-slate-400 text-lg mb-8">
                  Your payment has been processed securely
                </p>

                {/* Payment Details */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 text-left">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Payment Details
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Amount</p>
                      <p className="text-3xl font-bold text-blue-400">
                        ${(paymentData.amount / 100).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Currency</p>
                      <p className="text-2xl font-bold text-slate-200">
                        {paymentData.currency.toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Status</p>
                      <p className="text-2xl font-bold text-green-400 capitalize">
                        {paymentData.status}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-1">Payment ID</p>
                    <p className="text-sm font-mono text-slate-300 break-all">
                      {paymentData.paymentIntentId}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                {paymentData.customerInfo && (
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 text-left">
                    <h2 className="text-xl font-bold text-white mb-6">
                      Customer Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Name</p>
                        <p className="text-slate-200 font-semibold">
                          {paymentData.customerInfo.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Email</p>
                        <p className="text-slate-200 font-semibold break-all">
                          {paymentData.customerInfo.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Phone</p>
                        <p className="text-slate-200 font-semibold">
                          {paymentData.customerInfo.phone || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Country</p>
                        <p className="text-slate-200 font-semibold">
                          {paymentData.customerInfo.country}
                        </p>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <p className="text-sm text-slate-400 mb-2">
                        Billing Address
                      </p>
                      <p className="text-slate-200 font-semibold mb-1">
                        {paymentData.customerInfo.address}
                      </p>
                      <p className="text-slate-200 font-semibold">
                        {paymentData.customerInfo.city}, {paymentData.customerInfo.state}{' '}
                        {paymentData.customerInfo.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <p className="text-xs text-slate-400 mb-8">
                  🔒 Your payment information is secure and encrypted. A confirmation
                  email has been sent to your inbox.
                </p>

                {/* Action Button */}
                <Link
                  href="/"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
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
