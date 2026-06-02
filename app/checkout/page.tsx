import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Particles } from "@/components/particles"
import { PaymentButton } from "@/components/payment-button"

export const metadata: Metadata = {
  title: "Buy Now - N0Render SMART BOX",
  description: "Purchase the N0Render SMART BOX - Next generation smart entertainment device.",
}

export default function CheckoutPage() {
  return (
    <>
      <Particles />
      <Navbar centerText="SECURE CHECKOUT" showFullNav={false} />

      <main>
        <section
          id="checkout"
          className="hero"
          style={{
            minHeight: "80vh",
            paddingTop: "10rem",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div
            className="sleek-mockup glass glow-container"
            style={{ maxWidth: "500px", margin: "0 auto 2rem auto" }}
          >
            <div className="neon-glow"></div>
            <Image
              src="/mockup.png"
              alt="N0Render Mockup"
              width={400}
              height={300}
              className="mockup-image"
            />
          </div>
          <h1 className="glow-text" style={{ fontSize: "3rem" }}>
            <span className="n0render-brand">N0Render</span> smart box
          </h1>
          <h2
            style={{
              fontSize: "4rem",
              color: "var(--primary-color)",
              margin: "1rem 0 0.5rem",
              textShadow: "var(--glow)",
            }}
          >
            $125
          </h2>
          <div
            style={{
              marginBottom: "2rem",
              color: "var(--text-muted)",
              fontSize: "1.2rem",
              lineHeight: "1.5",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            <p>125$ WITH ONE MONTH FREE 3-TIER PREMIUM STREAMING</p>
            <p style={{ color: "var(--secondary-color)", marginTop: "0.5rem" }}>
              25$ FROM SECOND MONTH FOR PREMIUM 3-TIER STREAMING
            </p>
          </div>
          <div className="cta-group" style={{ justifyContent: "center" }}>
            <PaymentButton />
          </div>
        </section>
      </main>

      <Footer minimal />
    </>
  )
}
