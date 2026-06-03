'use client'

import { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

type FormData = {
  name: string
  email: string
  address: string
  city: string
  country: string
  postalCode: string
}

export function StripePaymentProvider() {
  const [clientSecret, setClientSecret] = useState('')
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const createIntent = async () => {
    setLoading(true)

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    console.log('Payment intent response:', data)

    setClientSecret(data.clientSecret)
    setLoading(false)
  }

  if (!clientSecret) {
    return (
      <div className="payment-box">
        <h1>Payment Form</h1>
        <p>Total Amount: $125</p>

        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="address" placeholder="Billing Address" value={form.address} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="country" placeholder="Country Code e.g. US" value={form.country} onChange={handleChange} />
        <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} />

        <button type="button" onClick={createIntent} disabled={loading}>
          {loading ? 'Loading...' : 'Continue to Payment'}
        </button>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <PaymentForm form={form} />
    </Elements>
  )
}

function PaymentForm({ form }: { form: FormData }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)

    console.log('User information before payment:', form)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
        payment_method_data: {
          billing_details: {
            name: form.name,
            email: form.email,
            address: {
              line1: form.address,
              city: form.city,
              country: form.country,
              postal_code: form.postalCode,
            },
          },
        },
      },
    })

    if (error) {
      console.log('Stripe payment error:', error)
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <form className="payment-box" onSubmit={handlePay}>
      <h1>Pay $125</h1>

      <PaymentElement />

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}