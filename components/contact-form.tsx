"use client"

import { useState, useCallback, type FormEvent } from "react"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")

    const form = e.currentTarget

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    }

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Failed to send form")
      }

      setStatus("sent")
      form.reset()

      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    } catch (error) {
      console.error(error)
      setStatus("idle")
      alert("Something went wrong. Please try again.")
    }
  }, [])

  return (
    <form className="contact-form glass" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="John Doe" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="john@example.com" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={5} placeholder="How can we help you?" required></textarea>
      </div>
      <button
        type="submit"
        className="btn btn-primary submit-btn"
        style={
          status === "sent"
            ? {
                background: "#28a745",
                boxShadow: "0 4px 15px rgba(40, 167, 69, 0.4)",
              }
            : {}
        }
        disabled={status === "sending"}
      >
        {status === "idle" && "Send Message"}
        {status === "sending" && "Sending..."}
        {status === "sent" && "Message Sent!"}
      </button>
    </form>
  )
}
