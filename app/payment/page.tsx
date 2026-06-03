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