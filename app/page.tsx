"use client"

import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Particles } from "@/components/particles"
import { SplineScene } from "@/components/spline-scene"
import { TestimonialDeck } from "@/components/testimonial-deck"
import { useFadeInOnScroll, useGlassEffect } from "@/hooks/use-effects"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const glassRef = useGlassEffect<HTMLElement>()
  const fadeRef = useFadeInOnScroll<HTMLElement>()

  return (
    <>
      <Particles />
      <Navbar />

      <main ref={(node) => {
        if (node) {
          (glassRef as React.MutableRefObject<HTMLElement | null>).current = node;
          (fadeRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      }}>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content">
            <h1 className="glow-text">
              <span className="n0render-brand">N0Render</span> smart box
            </h1>
            <h2>Smart Entertainment. Powerful Performance.</h2>
            <p>
              A next-generation smart box designed for smooth streaming, gaming, media playback, and advanced
              connectivity.
            </p>
            <div className="cta-group">
              <Link href="#features" className="btn btn-primary">
                Explore Features
              </Link>
              <Link href="/checkout" className="btn btn-secondary">
                Buy Now
              </Link>
            </div>
          </div>
          <div className="hero-showcase" id="spline-container">
            <div className="glow-sphere"></div>
            <SplineScene />
          </div>
        </section>

        {/* Product Description Section */}
        <section id="description" className="product-description">
          <h2 className="section-title">Designed for Modern Entertainment</h2>
          <div className="description-grid">
            <div className="description-text">
              <div className="feature-card glass">
                <i className="ri-rocket-line"></i>
                <h3>Ultra-fast performance (4 GB RAM / 64 GB ROM)</h3>
              </div>
              <div className="feature-card glass">
                <i className="ri-tv-2-line"></i>
                <h3>4K media support</h3>
              </div>
              <div className="feature-card glass">
                <i className="ri-wifi-line"></i>
                <h3>Smart connectivity</h3>
              </div>
              <div className="feature-card glass">
                <i className="ri-gamepad-line"></i>
                <h3>Retro Gaming Ready</h3>
              </div>
              <div className="feature-card glass">
                <i className="ri-layout-3-line"></i>
                <h3>Compact premium design</h3>
              </div>
              <div className="feature-card glass">
                <i className="ri-settings-4-line"></i>
                <h3>Easy setup</h3>
              </div>
            </div>
            <div className="description-image">
              <div className="sleek-mockup glass glow-container">
                <div className="neon-glow"></div>
                <Image
                  src="/mockup.png"
                  alt="n0render Mockup"
                  width={400}
                  height={300}
                  className="mockup-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2 className="section-title">Core Features</h2>
          <div className="features-grid">
            <div className="feature-item glass">
              <i className="ri-cpu-line"></i>
              <h3>Powerful hardware</h3>
              <p>Next-gen processor for seamless multitasking.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-magic-line"></i>
              <h3>Smooth user experience</h3>
              <p>Fluid UI with zero lag or stuttering.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-base-station-line"></i>
              <h3>Fast wireless connectivity</h3>
              <p>Wi-Fi 6 and Bluetooth 5.2 enabled.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-hard-drive-2-line"></i>
              <h3>Expandable storage</h3>
              <p>add your own sd card</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-snowy-line"></i>
              <h3>Modern cooling system</h3>
              <p>Whisper-quiet thermals for sustained loads.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-leaf-line"></i>
              <h3>Energy efficient</h3>
              <p>Eco-friendly power consumption mode.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-tv-line"></i>
              <h3>IP TV Experience</h3>
              <p>Seamlessly stream live TV and on-demand content.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-radio-line"></i>
              <h3>Built in TV Radio</h3>
              <p>Listen to your favorite stations directly from the box.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-graduation-cap-line"></i>
              <h3>E-Learning</h3>
              <p>Access educational platforms and interactive courses.</p>
            </div>
            <div className="feature-item glass">
              <i className="ri-heart-pulse-line"></i>
              <h3>Workout and Weight loss training</h3>
              <p>Follow fitness routines and stay healthy at home.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials">
          <h2 className="section-title">Reviews From Customers</h2>
          <TestimonialDeck />
        </section>

        {/* Tech Support Section */}
        <section id="support" className="support">
          <h2 className="section-title">Technical Support</h2>
          <div className="support-container">
            <div className="support-links glass">
              <ul>
                <li>
                  <i className="ri-tools-line"></i> Troubleshooting support
                </li>
                <li>
                  <i className="ri-download-cloud-2-line"></i> Firmware assistance
                </li>
                <li>
                  <i className="ri-book-read-line"></i> Device setup guidance
                </li>
                <li>
                  <i className="ri-refresh-line"></i> Software updates
                </li>
                <li>
                  <i className="ri-customer-service-2-line"></i> Customer help center
                </li>
              </ul>
            </div>
            <div className="support-card glass highlight">
              <h3>Contact Support Team</h3>
              <div className="contact-methods">
                <div className="method">
                  <i className="ri-mail-send-line"></i>
                  <span style={{ textTransform: "lowercase" }}>tech@n0render.com</span>
                </div>
                <div className="method">
                  <i className="ri-time-line"></i>
                  <span>10am to 8pm Central Time</span>
                </div>
                <div className="method">
                  <i className="ri-phone-line"></i>
                  <span>+1 612 642 2780 Ext 802</span>
                </div>
              </div>
              <div className="response-time">
                <div className="pulse-dot"></div>
                <span>{"Avg. response time: < 30 minutes"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-wrapper">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
