"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Leaf, Users, BarChart3 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { LanguageSelector } from "@/components/LanguageSelector"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Recycle className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EcoCycle XR</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <nav className="flex space-x-4">
                <Link href="/login">
                  <Button variant="outline">{t("login")}</Button>
                </Link>
                <Link href="/register">
                  <Button>{t("register")}</Button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t("heroTitle")} <span className="text-green-600">{t("heroTitleHighlight")}</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">{t("heroDescription")}</p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/login">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                {t("registerWaste")}
              </Button>
            </Link>
            <Link href="/traceability">
              <Button size="lg" variant="outline">
                {t("trackProduct")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900">{t("mainFeatures")}</h3>
            <p className="mt-4 text-lg text-gray-600">{t("featuresDescription")}</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Recycle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>{t("aiValorization")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("aiValorizationDesc")}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>{t("totalTraceability")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("totalTraceabilityDesc")}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>{t("environmentalImpact")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("environmentalImpactDesc")}</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>{t("circularEconomy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("circularEconomyDesc")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white">{t("readyToDifference")}</h3>
          <p className="mt-4 text-xl text-green-100">{t("joinRevolution")}</p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" variant="secondary">
                {t("startNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 EcoCycle XR. {t("allRightsReserved")}.</p>
        </div>
      </footer>
    </div>
  )
}
