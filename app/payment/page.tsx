'use client'

import { useState } from 'react'
import { Checkout } from '@/components/checkout'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

export default function PaymentPage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.name && userData.email && userData.phone) {
      setIsFormSubmitted(true)
    } else {
      alert('Please fill in all fields')
    }
  }

  return (
    <>
      <Particles />
      <Navbar centerText="PAYMENT" showFullNav={false} />

      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {!isFormSubmitted ? (
            <div className="glass p-8 rounded-lg shadow-lg">
              <h1 className="text-4xl font-bold mb-8 text-center glow-text">
                Enter Your Information
              </h1>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <Checkout productId="n0render-smart-box" userData={userData} />
          )}
        </div>
      </main>

      <Footer minimal />
    </>
  )
}
