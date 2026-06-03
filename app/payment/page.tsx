'use client'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Particles } from '@/components/particles'
import { StripePaymentProvider } from '@/components/stripe-payment-form'

export default function PaymentPage() {
  return (
    <>
      <Particles />
      <Navbar centerText="PAYMENT" showFullNav={false} />

      <main className="paymentPage">
        <section className="paymentHero">
          <div className="paymentFormCard">
            <StripePaymentProvider />
          </div>
        </section>
      </main>

      <Footer minimal />
    </>
  )
}