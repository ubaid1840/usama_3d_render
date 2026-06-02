"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useGlassEffect<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const cards = ref.current?.querySelectorAll(".glass")
    if (!cards) return

    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty("--mouse-x", `${x}px`)
      card.style.setProperty("--mouse-y", `${y}px`)
    }

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove as EventListener)
    })

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove as EventListener)
      })
    }
  }, [])

  return ref
}

export function useFadeInOnScroll<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const fadeElements = container.querySelectorAll(".glass, .section-title, .hero-content")

    fadeElements.forEach((el) => {
      el.classList.add("fade-in")
    })

    const appearOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear")
          observer.unobserve(entry.target)
        }
      })
    }, appearOptions)

    fadeElements.forEach((el) => {
      appearOnScroll.observe(el)
    })

    return () => {
      appearOnScroll.disconnect()
    }
  }, [])

  return ref
}
