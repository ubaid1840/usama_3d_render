"use client"
import Link from "next/link"
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  centerText?: string
  showFullNav?: boolean
}

export function Navbar({ centerText = "WELCOME TO THE FUTURE", showFullNav = true }: NavbarProps) {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link href="/" className="logo-link">
        <img
          src="/logo.png"
          alt="N0Render Logo"
          className="logo-image"
          style={{
            objectFit: "contain",
            width: "auto",
            height: "80px",
          }}
        />
      </Link>

      {!showFullNav && <div>{centerText}</div>}

      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {showFullNav ? (
          <>
            <li>
              <Link href="/#home">Home</Link>
            </li>
            <li>
              <Link href="/#description">Product</Link>
            </li>
            <li>
              <Link href="/#features">Features</Link>
            </li>
            <li>
              <Link href="/#support">Support</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
            <li>
              <Link
                href="/checkout"
                className="btn btn-primary"
                style={{
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.85rem",
                  color: "white",
                }}
              >
                BUY NOW
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/"
              className="btn btn-secondary"
              style={{
                padding: "0.5rem 1.5rem",
                fontSize: "0.85rem",
                color: "white",
              }}
            >
              BACK TO HOME
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
