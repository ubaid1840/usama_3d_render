"use client"

import { useEffect, useRef } from "react"

export function Particles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particleCount = 15

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.classList.add("particle")

      const size = Math.random() * 200 + 50
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5
      const isPurple = Math.random() > 0.5
      const color = isPurple ? "rgba(108, 59, 255, 0.4)" : "rgba(47, 128, 255, 0.4)"

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${x}vw`
      particle.style.top = `${y}vh`
      particle.style.animationDuration = `${duration}s`
      particle.style.animationDelay = `${delay}s`
      particle.style.background = color

      container.appendChild(particle)
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return <div className="particles" id="particles" ref={containerRef}></div>
}
