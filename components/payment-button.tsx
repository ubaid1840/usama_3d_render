'use client'

import Link from 'next/link'

export function PaymentButton() {
  return (
    <Link href="/payment">
      <button className="btn btn-primary" style={{ fontSize: "1.5rem", padding: "1rem 3rem" }}>
        PROCEED TO PAYMENT
      </button>
    </Link>
  )
}
