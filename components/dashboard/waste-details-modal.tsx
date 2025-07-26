"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  Package,
  Leaf,
  Route,
  DollarSign,
  Brain,
  QrCode,
} from "lucide-react"
import { getSectorColor } from "@/lib/services/imageService"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import type { Waste } from "@/lib/models/Waste"
import type { User } from "@/lib/models/User"
import type { Traceability } from "@/lib/models/Traceability"

interface WasteDetailsModalProps {
  waste: Waste | null
  user: User
  isOpen: boolean
  onClose: () => void
}

export function WasteDetailsModal({ waste, user, isOpen, onClose }: WasteDetailsModalProps) {
  const { t } = useLanguage()
  const [selectedRoute, setSelectedRoute] = useState<number>(0)
  const [traceability, setTraceability] = useState<Traceability | null>(null)
  const [loadingTraceability, setLoadingTraceability] = useState(false)

  useEffect(() => {
    if (waste && isOpen) {
      loadTraceability()
    }
  }, [waste, isOpen])

  const loadTraceability = async () => {
    if (!waste?._id) return

    setLoadingTraceability(true)
    try {
      // Primero intentar obtener trazabilidad existente
      const response = await fetch(`/api/traceability/waste/${waste._id}`)
      const data = await response.json()

      if (data.success) {
        setTraceability(data.traceability)
      } else {
        // Si no existe, crear nueva trazabilidad con IA
        const createResponse = await fetch("/api/traceability/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wasteId: waste._id,
            userId: user._id,
          }),
        })

        const createData = await createResponse.json()
        if (createData.success) {
          setTraceability(createData.traceability)
        }
      }
    } catch (error) {
      console.error("Error loading traceability:", error)
    } finally {
      setLoadingTraceability(false)
    }
  }

  if (!waste) return null

  const getWasteImage = (waste: Waste) => {
    if (waste.generatedImage) {
      return waste.generatedImage
    }
    const query = `${waste.name} ${waste.sector} waste recycling`
    return `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(query)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "valorized":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "registered":
        return t("registered")
      case "processing":
        return t("processing")
      case "valorized":
        return t("valorized")
      case "completed":
        return t("completed")
      default:
        return "Desconocido"
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "current":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Package className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{waste.name}</DialogTitle>
              <DialogDescription className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(waste.status)}>{getStatusText(waste.status)}</Badge>
                <Badge className={getSectorColor(waste.sector)}>{waste.sector}</Badge>
                {traceability && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Brain className="h-3 w-3 mr-1" />
                    {t("aiGeneratedTraceability")}
                  </Badge>
                )}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="routes">{t("valorizationRoutes")}</TabsTrigger>
            <TabsTrigger value="traceability">{t("traceability")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagen del residuo */}
              <div>
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={getWasteImage(waste) || "/placeholder.svg"}
                        alt={waste.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(waste.name + " waste")}`
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{waste.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{waste.composition}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Información del residuo */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{t("quantity")}:</span>
                      <span className="ml-2">
                        {waste.quantity} {waste.unit}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{t("registered")}:</span>
                      <span className="ml-2">{new Date(waste.createdAt).toLocaleDateString("es-ES")}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Ubicación:</span>
                      <span className="ml-2 line-clamp-1">{waste.location.address}</span>
                    </div>

                    {traceability && (
                      <div className="flex items-center text-sm">
                        <QrCode className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Código QR:</span>
                        <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {traceability.qrCode}
                        </span>
                      </div>
                    )}

                    {waste.userType === "empresa" && waste.companyInfo && (
                      <>
                        <div className="flex items-center text-sm">
                          <span className="font-medium">{t("department")}:</span>
                          <span className="ml-2">{waste.companyInfo.department}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium">Contacto:</span>
                          <span className="ml-2">{waste.companyInfo.contactPerson}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium">Urgencia:</span>
                          <Badge
                            variant={
                              waste.companyInfo.urgency === "critica"
                                ? "destructive"
                                : waste.companyInfo.urgency === "alta"
                                  ? "default"
                                  : "secondary"
                            }
                            className="ml-2"
                          >
                            {waste.companyInfo.urgency}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de rutas */}
              <div className="lg:col-span-1">
                <h3 className="font-semibold mb-3">
                  {t("availableRoutes")} ({waste.routes.length})
                </h3>
                <div className="space-y-2">
                  {waste.routes.map((route, index) => (
                    <Card
                      key={route.id}
                      className={`cursor-pointer transition-colors ${
                        selectedRoute === index ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedRoute(index)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{route.name}</h4>
                            <p className="text-xs text-gray-600">
                              {t("efficiency")}: {route.efficiency}%
                            </p>
                          </div>
                          <Badge variant="outline">{index + 1}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Detalles de la ruta seleccionada */}
              <div className="lg:col-span-2">
                {waste.routes[selectedRoute] && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Route className="h-5 w-5 mr-2" />
                        {waste.routes[selectedRoute].name}
                      </CardTitle>
                      <CardDescription>{waste.routes[selectedRoute].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Métricas principales */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-green-600">
                            {waste.routes[selectedRoute].efficiency}%
                          </div>
                          <div className="text-xs text-gray-600">{t("efficiency")}</div>
                        </div>

                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Leaf className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-blue-600">
                            {waste.routes[selectedRoute].co2Reduction}
                          </div>
                          <div className="text-xs text-gray-600">{t("co2Avoided")}</div>
                        </div>

                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-purple-600">
                            ${waste.routes[selectedRoute].estimatedValue}
                          </div>
                          <div className="text-xs text-gray-600">{t("estimatedValue")}</div>
                        </div>

                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-orange-600">
                            {waste.routes[selectedRoute].processingTime}
                          </div>
                          <div className="text-xs text-gray-600">{t("processingDays")}</div>
                        </div>
                      </div>

                      {/* Requerimientos */}
                      <div>
                        <h4 className="font-medium mb-2">{t("requirements")}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {waste.routes[selectedRoute].requirements.map((req, index) => (
                            <Badge key={index} variant="outline">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t("selectRoute")}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="traceability" className="space-y-4">
            {loadingTraceability ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando trazabilidad con IA...</p>
              </div>
            ) : traceability ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    {t("wasteTraceability")}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{t("completeLifecycleTracking")}</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      <Brain className="h-3 w-3 mr-1" />
                      Generado por IA
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {traceability.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-4 relative">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : step.status === "current"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {getStepStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{step.title}</h3>
                            <Badge
                              variant={
                                step.status === "completed"
                                  ? "default"
                                  : step.status === "current"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {step.status === "completed"
                                ? t("completed")
                                : step.status === "current"
                                  ? t("processing")
                                  : "Pendiente"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <div className="flex items-center space-x-4">
                              <span>📍 {step.location}</span>
                              <span>👤 {step.responsible}</span>
                            </div>
                            {step.estimatedDuration && <div>⏱️ Duración: {step.estimatedDuration}</div>}
                            {step.date && (
                              <div>
                                📅{" "}
                                {new Date(step.date).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                            {step.environmentalImpact && (
                              <div className="flex items-center space-x-3 text-green-600">
                                <span>🌱 CO2: -{step.environmentalImpact.co2Reduction}kg</span>
                                <span>⚡ Energía: {step.environmentalImpact.energySaved}kWh</span>
                                <span>💧 Agua: {step.environmentalImpact.waterSaved}L</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < traceability.steps.length - 1 && (
                          <div className="absolute left-5 top-10 w-px h-8 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Impacto total */}
                  <div className="mt-8 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Impacto Ambiental Total</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{traceability.impact.co2Avoided}</div>
                        <div className="text-green-700">kg CO2 evitado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{traceability.impact.energySaved}</div>
                        <div className="text-blue-700">kWh ahorrados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">{traceability.impact.waterSaved}</div>
                        <div className="text-cyan-700">L agua ahorrada</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{traceability.impact.wasteReduced}</div>
                        <div className="text-purple-700">kg residuo reducido</div>
                      </div>
                    </div>
                  </div>

                  {/* Recomendaciones de IA */}
                  {traceability.recommendations.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Recomendaciones de IA
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        {traceability.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se pudo generar la trazabilidad</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
