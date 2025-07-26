"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, ArrowLeft, User } from "lucide-react"
import Link from "next/link"

interface WasteData {
  name: string
  sector: string
  composition: string
  quantity: number
  unit: string
  location: {
    address: string
  }
}

interface ValorizationRoute {
  id: string
  name: string
  description: string
  efficiency: number
  co2Reduction: number
  estimatedValue: number
}

export default function PersonaWasteFormPage() {
  const [formData, setFormData] = useState<WasteData>({
    name: "",
    sector: "residencial",
    composition: "",
    quantity: 0,
    unit: "kg",
    location: {
      address: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<ValorizationRoute[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/waste/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType: "persona",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setRoutes(data.waste.routes)
        setSubmitted(true)
      } else {
        alert(data.errors?.join(", ") || "Error al registrar residuo")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    if (field === "address") {
      setFormData((prev) => ({
        ...prev,
        location: { address: value as string },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </div>

          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Residuo registrado exitosamente! Aquí están las rutas de valorización recomendadas por nuestra IA.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-gray-900">Rutas de Valorización Recomendadas</h2>

            {routes.map((route, index) => (
              <Card key={route.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        #{index + 1} {route.name}
                      </CardTitle>
                      <CardDescription>{route.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Eficiencia</div>
                      <div className="text-2xl font-bold text-green-600">{route.efficiency}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">CO2 Reducido</div>
                      <div className="text-lg font-semibold text-blue-600">{route.co2Reduction} kg CO2</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Valor Estimado</div>
                      <div className="text-lg font-semibold text-green-600">${route.estimatedValue}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex space-x-4">
            <Button
              onClick={() => {
                setSubmitted(false)
                setRoutes([])
                setFormData({
                  name: "",
                  sector: "residencial",
                  composition: "",
                  quantity: 0,
                  unit: "kg",
                  location: { address: "" },
                })
              }}
            >
              Registrar Otro Residuo
            </Button>
            <Link href="/impact">
              <Button variant="outline">Ver Impacto Ambiental</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/waste-form" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a selección
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Registrar Residuo - Persona</CardTitle>
                <CardDescription>
                  Completa la información del residuo doméstico para obtener recomendaciones de valorización
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nombre del Residuo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Botellas de plástico, Papel periódico, etc."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="composition">Descripción y Composición</Label>
                <Textarea
                  id="composition"
                  placeholder="Describe el residuo: materiales, estado, características especiales..."
                  value={formData.composition}
                  onChange={(e) => handleInputChange("composition", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.quantity || ""}
                    onChange={(e) => handleInputChange("quantity", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidad</Label>
                  <Select onValueChange={(value) => handleInputChange("unit", value)} defaultValue="kg">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="litros">Litros</SelectItem>
                      <SelectItem value="m3">Metros cúbicos (m³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección de Recolección</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Calle, número, colonia, ciudad..."
                  value={formData.location.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando residuo...
                  </>
                ) : (
                  "Obtener Recomendaciones de IA"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
