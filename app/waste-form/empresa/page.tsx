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
import { Loader2, CheckCircle, ArrowLeft, Building } from "lucide-react"
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
  companyInfo?: {
    department: string
    contactPerson: string
    urgency: string
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

export default function EmpresaWasteFormPage() {
  const [formData, setFormData] = useState<WasteData>({
    name: "",
    sector: "industrial",
    composition: "",
    quantity: 0,
    unit: "kg",
    location: {
      address: "",
    },
    companyInfo: {
      department: "",
      contactPerson: "",
      urgency: "media",
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
          userType: "empresa",
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
    } else if (field.startsWith("company.")) {
      const companyField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo!,
          [companyField]: value,
        },
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
              ¡Residuo empresarial registrado exitosamente! Nuestro equipo se pondrá en contacto para coordinar la
              recolección.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-gray-900">Rutas de Valorización Empresarial</h2>

            {routes.map((route, index) => (
              <Card key={route.id} className="border-l-4 border-l-blue-500">
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
                      <div className="text-2xl font-bold text-blue-600">{route.efficiency}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">CO2 Reducido</div>
                      <div className="text-lg font-semibold text-green-600">{route.co2Reduction} kg CO2</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Valor Estimado</div>
                      <div className="text-lg font-semibold text-blue-600">${route.estimatedValue}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Volumen Mínimo</div>
                      <div className="text-lg font-semibold text-gray-600">100 kg</div>
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
                  sector: "industrial",
                  composition: "",
                  quantity: 0,
                  unit: "kg",
                  location: { address: "" },
                  companyInfo: {
                    department: "",
                    contactPerson: "",
                    urgency: "media",
                  },
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
              <Building className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Registrar Residuo - Empresa</CardTitle>
                <CardDescription>
                  Completa la información del residuo industrial para obtener recomendaciones especializadas
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
                  placeholder="Ej: Residuos metálicos, Solventes industriales, etc."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sector">Sector Industrial</Label>
                <Select onValueChange={(value) => handleInputChange("sector", value)} defaultValue="industrial">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="manufactura">Manufactura</SelectItem>
                    <SelectItem value="quimico">Químico</SelectItem>
                    <SelectItem value="alimentario">Alimentario</SelectItem>
                    <SelectItem value="textil">Textil</SelectItem>
                    <SelectItem value="construccion">Construcción</SelectItem>
                    <SelectItem value="farmaceutico">Farmacéutico</SelectItem>
                    <SelectItem value="automotriz">Automotriz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="composition">Composición Técnica</Label>
                <Textarea
                  id="composition"
                  placeholder="Describe la composición química, materiales, concentraciones, peligrosidad, etc."
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
                      <SelectItem value="ton">Toneladas</SelectItem>
                      <SelectItem value="litros">Litros</SelectItem>
                      <SelectItem value="m3">Metros cúbicos (m³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección de la Planta/Empresa</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Dirección completa de la empresa..."
                  value={formData.location.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Ej: Producción, Mantenimiento..."
                    value={formData.companyInfo?.department || ""}
                    onChange={(e) => handleInputChange("company.department", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Persona de Contacto</Label>
                  <Input
                    id="contactPerson"
                    type="text"
                    placeholder="Nombre del responsable"
                    value={formData.companyInfo?.contactPerson || ""}
                    onChange={(e) => handleInputChange("company.contactPerson", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Urgencia de Recolección</Label>
                <Select onValueChange={(value) => handleInputChange("company.urgency", value)} defaultValue="media">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja - Dentro de 30 días</SelectItem>
                    <SelectItem value="media">Media - Dentro de 15 días</SelectItem>
                    <SelectItem value="alta">Alta - Dentro de 7 días</SelectItem>
                    <SelectItem value="critica">Crítica - Inmediata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando residuo empresarial...
                  </>
                ) : (
                  "Obtener Análisis Especializado"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
