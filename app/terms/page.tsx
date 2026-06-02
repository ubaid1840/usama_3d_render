import type { Metadata } from "next"
import Link from "next/link"
import { Particles } from "@/components/particles"

export const metadata: Metadata = {
  title: "Terms of Service - N0Render",
  description: "Terms of Service for N0Render SMART BOX.",
}

export default function TermsPage() {
  return (
    <>
      <Particles />
      <div style={{ padding: "5rem 5%", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }}>
        <h1 className="glow-text" style={{ fontSize: "3rem", marginBottom: "2rem" }}>
          <span className="n0render-brand">N0Render</span> Terms of Service
        </h1>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          Welcome to N0Render. By using our website and products, you agree to these terms.
        </p>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          1. Acceptance of Terms: By accessing and using our services, you accept and agree to be bound by the
          terms and provision of this agreement.
        </p>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          2. Use of Product: Our smart box is intended for personal entertainment use. Modifying or
          reverse-engineering the hardware may void your warranty.
        </p>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          3. Limitation of Liability: We shall not be liable for any indirect, incidental, or consequential
          damages resulting from the use of our product.
        </p>
        <Link href="/" className="btn btn-primary" style={{ textTransform: "uppercase" }}>
          Return to Home
        </Link>
      </div>
    </>
  )
}
