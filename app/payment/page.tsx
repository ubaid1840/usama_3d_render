'use client'

import { StripePaymentProvider } from '@/components/stripe-payment-form'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

export default function PaymentPage() {
  return (
    <>
      <Particles />
      <Navbar centerText="PAYMENT" showFullNav={false} />

      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <StripePaymentProvider />
      </main>

      <Footer minimal />
    </>
  )
}

