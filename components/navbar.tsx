import Link from "next/link"
import Image from "next/image"

interface NavbarProps {
  centerText?: string
  showFullNav?: boolean
}

export function Navbar({ centerText = "WELCOME TO THE FUTURE", showFullNav = true }: NavbarProps) {
  return (
    <nav className="navbar">
      <Link href="/" className="logo-link">
        <img src="/logo.png" alt="N0Render Logo" className="logo-image" style={{objectFit:'contain',width:'auto', height:'80px', }} />
      </Link>
     
      <ul className="nav-links">
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
                style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", marginLeft: "0.5rem", color: "white" }}
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
              style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", color: "white" }}
            >
              BACK TO HOME
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
