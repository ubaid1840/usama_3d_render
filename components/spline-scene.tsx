"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <p>Loading object...</p>
})

export function SplineScene() {
  return (
    <Suspense fallback={<div className="w-full h-full" />}>
      <Spline scene="https://prod.spline.design/00aC1k5ZycTSh4gR/scene.splinecode" />
    </Suspense>
  )
}
