import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/lib/contexts/LanguageContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoCycle XR - Plataforma de Economía Circular",
  description: "Transformamos residuos en oportunidades mediante inteligencia artificial y trazabilidad completa",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
