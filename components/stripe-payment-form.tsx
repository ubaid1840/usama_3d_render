'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ReCAPTCHA from "react-google-recaptcha";



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
   const [captchaToken, setCaptchaToken] = useState("")
  const { executeRecaptcha } = useGoogleReCaptcha();
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

    if (!executeRecaptcha) {
  setError("Captcha not ready");
  return;
}

const captchaToken = await executeRecaptcha("payment");

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
        body: JSON.stringify({...form, captchaToken}),
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

         const orderData = {
    paymentIntentId: paymentIntent.id,
    customerInfo: form,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    paymentStatus: paymentIntent.status,
    orderStatus: 'order placed',
    deliveryStatus: 'pending',
    productName: 'N0Render Smart Box',
    createdAt: serverTimestamp(),
  }

  const orderRef = await addDoc(collection(db, 'orders'), orderData)

  console.log('[Firebase Order Created]', {
    orderId: orderRef.id,
    ...orderData,
  })


        // await fetch('/api/payment', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     paymentIntentId: paymentIntent.id,
        //     customerInfo: form,
        //   }),
        // })

        // Redirect to success
        router.push(`/payment/success?payment_intent_id=${paymentIntent.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setLoading(false)
    }
  }

   function onSuccess(token: string) {
    setCaptchaToken(token)
  }

  const validateForm = () => {
  return (
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.address.trim() !== '' &&
    form.city.trim() !== '' &&
    form.state.trim() !== '' &&
    form.postalCode.trim() !== '' &&
    form.country.trim() !== ''
  )
}

  return (
    <div className="stripeCheckout">
      <div className="stripeCheckoutHeader">
        <div>
          <span className="stripeCheckoutLabel">Checkout</span>
          <h2>Secure Payment</h2>
          <p>N0Render Smart Box</p>
        </div>

        <div className="stripeCheckoutAmount">
          <strong>$125</strong>
          <span>.00 USD</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stripeCheckoutForm">
        <section className="stripeSection">
          <div className="stripeSectionHeader">
            <span>01</span>
            <h3>Contact Information</h3>
          </div>

          <div className="stripeGrid stripeGridTwo">
            <div className="stripeField">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
                required
              />
            </div>

            <div className="stripeField">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="stripeField">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              disabled={loading}
            />
          </div>
        </section>

        <section className="stripeSection">
          <div className="stripeSectionHeader">
            <span>02</span>
            <h3>Billing Address</h3>
          </div>

          <div className="stripeField">
            <label>Street Address *</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              disabled={loading}
              required
            />
          </div>

          <div className="stripeGrid stripeGridTwo">
            <div className="stripeField">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="New York"
                disabled={loading}
                required
              />
            </div>

            <div className="stripeField">
              <label>State / Province *</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="NY"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="stripeGrid stripeGridTwo">
            <div className="stripeField">
              <label>Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="10001"
                disabled={loading}
                required
              />
            </div>

            <div className="stripeField">
              <label>Country *</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                disabled={loading}
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
        </section>

        <section className="stripeSection">
          <div className="stripeSectionHeader">
            <span>03</span>
            <h3>Payment Method</h3>
          </div>

          <div className="stripeCardElement">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#0f172a',
                    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                    '::placeholder': {
                      color: '#94a3b8',
                    },
                  },
                  invalid: {
                    color: '#dc2626',
                  },
                },
              }}
            />
          </div>

          <p className="stripeSecurityText">
            Secure card processing by Stripe. We never store your card details.
          </p>
        </section>

        {error && (
          <div className="stripeError">
            {error}
          </div>
        )}

         <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={onSuccess}
              />

        <button
          type="submit"
          disabled={loading || !stripe || !elements || !captchaToken || !validateForm()}
          className="stripeSubmitButton"
        >
          {loading ? (
            <>
              <span className="stripeSpinner" />
              Processing Payment...
            </>
          ) : (
            'Pay $125.00'
          )}
        </button>
      </form>
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

