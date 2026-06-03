'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

interface PaymentData {
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID found')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const result = await response.json()

        if (result.success) {
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
  }, [sessionId])

  return (
    <>
      <Particles />
      <Navbar centerText="PAYMENT SUCCESSFUL" showFullNav={false} />

      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="glass p-8 rounded-lg shadow-lg text-center">
            {isLoading ? (
              <>
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold">Verifying your payment...</p>
              </>
            ) : error ? (
              <>
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-red-600">
                  Payment Error
                </h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <a
                  href="/payment"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Try Again
                </a>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-green-600">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your payment has been processed securely through Stripe.
                </p>

                {paymentData && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left text-sm">
                    <p className="text-gray-700 mb-2">
                      <strong>Name:</strong> {paymentData.customerName}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> {paymentData.customerEmail}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Phone:</strong> {paymentData.customerPhone}
                    </p>
                    <p className="text-gray-700">
                      <strong>Amount:</strong> ${(paymentData.amount / 100).toFixed(2)}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-6">
                  Session ID: {sessionId}
                </p>
                <a
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Return to Home
                </a>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer minimal />
    </>
  )
}
