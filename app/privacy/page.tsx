import type { Metadata } from "next"
import Link from "next/link"
import { Particles } from "@/components/particles"

export const metadata: Metadata = {
  title: "Privacy Policy - N0Render",
  description: "Privacy Policy for N0Render SMART BOX.",
}

export default function PrivacyPage() {
  return (
    <>
      <Particles />
      <div style={{ padding: "5rem 5%", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }}>
        <h1 className="glow-text" style={{ fontSize: "3rem", marginBottom: "2rem" }}>
          <span className="n0render-brand">N0Render</span> Privacy Policy
        </h1>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          Your privacy is important to us. It is N0Render&apos;s policy to respect your privacy regarding any
          information we may collect from you across our website and products.
        </p>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          1. Information We Collect: We only ask for personal information when we truly need it to provide a
          service to you. We collect it by fair and lawful means, with your knowledge and consent.
        </p>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          2. How We Use Information: We use the information we collect in various ways, including to provide,
          operate, and maintain our website and products.
        </p>
        <p
          style={{
            textTransform: "none",
            fontWeight: "400",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          3. Data Security: We value your trust in providing us your Personal Information, thus we are striving
          to use commercially acceptable means of protecting it.
        </p>
        <Link href="/" className="btn btn-primary" style={{ textTransform: "uppercase" }}>
          Return to Home
        </Link>
      </div>
    </>
  )
}
