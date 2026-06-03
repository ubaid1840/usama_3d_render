'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'
import './payment-success.css'

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
        const response = await fetch('/api/verify-payment', {
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

      <main className="successPage">
        <section className="successCard">
          {isLoading ? (
            <div className="successState">
              <div className="successSpinner" />
              <h1>Verifying payment</h1>
              <p>Please wait while we confirm your transaction.</p>
            </div>
          ) : error ? (
            <div className="successState">
              <div className="successIcon errorIcon">
                <span>!</span>
              </div>

              <h1>Payment Error</h1>
              <p>{error}</p>

              <Link href="/payment" className="successButton">
                Try Again
              </Link>
            </div>
          ) : paymentData ? (
            <>
              <div className="successHeader">
                <div className="successIcon">
                  <span>✓</span>
                </div>

                <span className="successLabel">Payment Verified</span>

                <h1>Payment Successful</h1>

                <p>
                  Your payment has been processed securely and verified successfully.
                </p>
              </div>

              <div className="successDetails">
                <div className="successDetailBox">
                  <span>Amount</span>
                  <strong>${(paymentData.amount / 100).toFixed(2)}</strong>
                </div>

                <div className="successDetailBox">
                  <span>Currency</span>
                  <strong>{paymentData.currency.toUpperCase()}</strong>
                </div>

                <div className="successDetailBox">
                  <span>Status</span>
                  <strong>{paymentData.status}</strong>
                </div>
              </div>

              <div className="successSection">
                <h2>Transaction Details</h2>

                <div className="successRow">
                  <span>Payment ID</span>
                  <strong>{paymentData.paymentIntentId}</strong>
                </div>
              </div>

              {paymentData.customerInfo && (
                <div className="successSection">
                  <h2>Customer Information</h2>

                  <div className="successInfoGrid">
                    <div className="successRow">
                      <span>Name</span>
                      <strong>{paymentData.customerInfo.name}</strong>
                    </div>

                    <div className="successRow">
                      <span>Email</span>
                      <strong>{paymentData.customerInfo.email}</strong>
                    </div>

                    <div className="successRow">
                      <span>Phone</span>
                      <strong>{paymentData.customerInfo.phone || 'N/A'}</strong>
                    </div>

                    <div className="successRow">
                      <span>Country</span>
                      <strong>{paymentData.customerInfo.country}</strong>
                    </div>
                  </div>

                  <div className="successAddress">
                    <span>Billing Address</span>
                    <strong>
                      {paymentData.customerInfo.address}, {paymentData.customerInfo.city},{' '}
                      {paymentData.customerInfo.state} {paymentData.customerInfo.postalCode}
                    </strong>
                  </div>
                </div>
              )}

              <p className="successSecurityText">
                Your payment information is encrypted and handled securely.
              </p>

              <Link href="/" className="successButton">
                Back to Home
              </Link>
            </>
          ) : null}
        </section>
      </main>

      <Footer minimal />
    </>
  )
}