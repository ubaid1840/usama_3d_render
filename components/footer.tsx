import Link from "next/link"

interface FooterProps {
  minimal?: boolean
}

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer>
        <div className="footer-content" style={{ justifyContent: "center", textAlign: "center" }}>
          <p>
            &copy; 2026 <span className="n0render-brand">N0Render</span> smart box. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-about">
          <h3>ABOUT US</h3>
          <p>
            Our goal is to provide you with the most professional, affordable, convenient hardware and/or software
            solution.
          </p>
        </div>
        <div className="footer-right">
          <div className="social-icons">
            <a href="#">
              <i className="ri-youtube-fill"></i>
            </a>
            <a href="#">
              <i className="ri-facebook-circle-fill"></i>
            </a>
            <a href="#">
              <i className="ri-instagram-line"></i>
            </a>
          </div>
          <p>
            &copy; 2026 <span className="n0render-brand">N0Render</span> smart box. All rights reserved.
          </p>
          <div className="footer-links">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link
              href="/checkout"
              className="btn btn-primary"
              style={{ padding: "0.5rem 1.5rem", fontSize: "0.85rem", marginLeft: "1rem", color: "white" }}
            >
              BUY NOW
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
