"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, MapPin, Factory, User, Recycle } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Importar el mapa dinámicamente para evitar problemas de SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>,
})

interface ProductCycle {
  stage: string
  date: string
  location: string
  description: string
  icon: React.ReactNode
  status: "completed" | "current" | "pending"
}

interface ValorizationPoint {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  distance: number
}

export default function TraceabilityPage() {
  const [qrCode, setQrCode] = useState("")
  const [productData, setProductData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular llamada a la API
      const response = await fetch("/api/traceability/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode }),
      })

      const data = await response.json()
      setProductData(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const productCycle: ProductCycle[] = productData
    ? [
        {
          stage: "Fabricación",
          date: "2024-01-15",
          location: "Planta Industrial, México",
          description: "Producto fabricado con materiales reciclados",
          icon: <Factory className="h-5 w-5" />,
          status: "completed",
        },
        {
          stage: "Distribución",
          date: "2024-01-20",
          location: "Centro de Distribución",
          description: "Producto distribuido a puntos de venta",
          icon: <MapPin className="h-5 w-5" />,
          status: "completed",
        },
        {
          stage: "Uso",
          date: "2024-02-01",
          location: "Usuario Final",
          description: "Producto en uso por el consumidor",
          icon: <User className="h-5 w-5" />,
          status: "current",
        },
        {
          stage: "Reciclaje",
          date: "Pendiente",
          location: "Centro de Reciclaje",
          description: "Producto listo para reciclaje",
          icon: <Recycle className="h-5 w-5" />,
          status: "pending",
        },
      ]
    : []

  const valorizationPoints: ValorizationPoint[] = productData
    ? [
        {
          id: "1",
          name: "EcoRecicla Centro",
          type: "Centro de Reciclaje",
          lat: 19.4326,
          lng: -99.1332,
          distance: 2.5,
        },
        {
          id: "2",
          name: "Planta de Valorización Norte",
          type: "Planta Industrial",
          lat: 19.4978,
          lng: -99.1269,
          distance: 8.2,
        },
        {
          id: "3",
          name: "Centro de Acopio Sur",
          type: "Centro de Acopio",
          lat: 19.391,
          lng: -99.1426,
          distance: 5.7,
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trazabilidad de Producto</h1>
          <p className="text-gray-600">Ingresa el código QR para rastrear el ciclo completo de tu producto</p>
        </div>

        {!productData ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Escanear Código QR
              </CardTitle>
              <CardDescription>Ingresa el código QR del producto para ver su trazabilidad</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="qrCode">Código QR</Label>
                  <Input
                    id="qrCode"
                    type="text"
                    placeholder="Ej: ECO-2024-001234"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Rastreando..." : "Rastrear Producto"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ciclo del Producto */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Ciclo del Producto</CardTitle>
                  <CardDescription>
                    Código: {qrCode} | Producto: {productData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productCycle.map((stage, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            stage.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : stage.status === "current"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {stage.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{stage.stage}</h3>
                            <Badge
                              variant={
                                stage.status === "completed"
                                  ? "default"
                                  : stage.status === "current"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {stage.status === "completed"
                                ? "Completado"
                                : stage.status === "current"
                                  ? "Actual"
                                  : "Pendiente"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                          <p className="text-xs text-gray-500">
                            {stage.date} • {stage.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mapa y Puntos de Valorización */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Puntos de Valorización Cercanos</CardTitle>
                  <CardDescription>Centros donde puedes llevar tu producto para reciclaje</CardDescription>
                </CardHeader>
                <CardContent>
                  <MapComponent points={valorizationPoints} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Centros Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {valorizationPoints.map((point) => (
                      <div key={point.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{point.name}</h4>
                          <p className="text-sm text-gray-600">{point.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{point.distance} km</p>
                          <Button size="sm" variant="outline">
                            Direcciones
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
