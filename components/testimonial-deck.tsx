"use client"

import { useState, useCallback } from "react"
import Image from "next/image"

const testimonialsData = [
  {
    id: 1,
    testimonial:
      "The streaming quality is flawless. I've completely replaced my old setup and the 4K playback is butter smooth.",
    author: "Marcus T.",
  },
  {
    id: 2,
    testimonial:
      "Setting this up took less than two minutes. The retro gaming feature alone makes it worth every penny.",
    author: "Sarah W.",
  },
  {
    id: 3,
    testimonial:
      "I can't believe how fast the UI is. Zero lag when switching between apps, and the connectivity is rock solid.",
    author: "David L.",
  },
]

export function TestimonialDeck() {
  const [positions, setPositions] = useState<string[]>(["front", "middle", "back"])

  const handleShuffle = useCallback(() => {
    setPositions((prev) => {
      const newPositions = [...prev]
      newPositions.unshift(newPositions.pop()!)
      return newPositions
    })
  }, [])

  return (
    <div className="testimonial-container">
      <div className="testimonial-deck">
        {testimonialsData.map((data, index) => (
          <div
            key={data.id}
            className="testimonial-card"
            data-pos={positions[index]}
            onClick={positions[index] === "front" ? handleShuffle : undefined}
            onKeyDown={
              positions[index] === "front"
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") handleShuffle()
                  }
                : undefined
            }
            role={positions[index] === "front" ? "button" : undefined}
            tabIndex={positions[index] === "front" ? 0 : undefined}
          >
            <Image
              src={`https://i.pravatar.cc/128?img=${data.id + 10}`}
              alt={`Avatar of ${data.author}`}
              width={128}
              height={128}
              className="rounded-full border-2 border-slate-700"
            />
            <p className="quote">&ldquo;{data.testimonial}&rdquo;</p>
            <p className="author">{data.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
