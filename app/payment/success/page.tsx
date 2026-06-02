'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Simulate sending data to backend
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }, [sessionId])

  return (
    <>
      <Particles />
      <Navbar centerText="PAYMENT SUCCESSFUL" showFullNav={false} />

      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="glass p-8 rounded-lg shadow-lg text-center">
            {isLoading ? (
              <>
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold">Processing your payment...</p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-green-600">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your information has been securely processed.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Session ID: {sessionId}
                </p>
                <a
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Return to Home
                </a>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer minimal />
    </>
  )
}
