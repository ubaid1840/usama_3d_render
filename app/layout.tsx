import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "N0Render SMART BOX - NEXT GENERATION SMART BOX",
  description:
    "A next-generation smart box designed for smooth streaming, gaming, media playback, and advanced connectivity.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="bg-[#0B1020]">
         <GoogleReCaptchaProvider
          reCaptchaKey={
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
          }
        >{children}
        </GoogleReCaptchaProvider>
        </body>
    </html>
  )
}
