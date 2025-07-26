"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Recycle, Calendar, MapPin, TrendingUp, Eye, Plus, Package, Leaf, Factory, Home } from "lucide-react"
import { WasteRegistrationModal } from "./waste-registration-modal"
import type { Waste } from "@/lib/models/Waste"
import type { User } from "@/lib/models/User"

interface WasteListProps {
  user: User
  wastes: Waste[]
  onWasteUpdate: () => void
}

export function WasteList({ user, wastes, onWasteUpdate }: WasteListProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

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
        return "Registrado"
      case "processing":
        return "En Proceso"
      case "valorized":
        return "Valorizado"
      case "completed":
        return "Completado"
      default:
        return "Desconocido"
    }
  }

  const getCategoryIcon = (sector: string) => {
    switch (sector) {
      case "industrial":
      case "manufactura":
      case "quimico":
      case "farmaceutico":
      case "automotriz":
        return <Factory className="h-5 w-5" />
      case "residencial":
        return <Home className="h-5 w-5" />
      case "alimentario":
        return <Leaf className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getWasteImage = (wasteName: string, sector: string) => {
    // Generar imagen basada en el nombre del residuo usando placeholder con query
    const query = `${wasteName} ${sector} waste recycling`
    return `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(query)}`
  }

  const categorizeWastes = (wastes: Waste[]) => {
    const categories: Record<string, Waste[]> = {}

    wastes.forEach((waste) => {
      const category = waste.sector || "otros"
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(waste)
    })

    return categories
  }

  const getCategoryName = (sector: string) => {
    switch (sector) {
      case "industrial":
        return "Industrial"
      case "manufactura":
        return "Manufactura"
      case "quimico":
        return "Químico"
      case "alimentario":
        return "Alimentario"
      case "residencial":
        return "Residencial"
      case "construccion":
        return "Construcción"
      case "textil":
        return "Textil"
      case "farmaceutico":
        return "Farmacéutico"
      case "automotriz":
        return "Automotriz"
      default:
        return "Otros"
    }
  }

  if (wastes.length === 0) {
    return (
      <>
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Recycle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No has registrado residuos aún</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comienza registrando tu primer residuo para obtener recomendaciones de valorización
          </p>
          <Button
            onClick={() => setShowRegistrationModal(true)}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Registrar Primer Residuo
          </Button>
        </div>

        <WasteRegistrationModal
          user={user}
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onWasteRegistered={onWasteUpdate}
        />
      </>
    )
  }

  const categorizedWastes = categorizeWastes(wastes)
  const categories = Object.keys(categorizedWastes)

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Total: {wastes.length} residuo{wastes.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-sm text-gray-600">Organizados por categorías</p>
          </div>
          <Button onClick={() => setShowRegistrationModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Nuevo
          </Button>
        </div>

        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-auto overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                {getCategoryIcon(category)}
                <span>{getCategoryName(category)}</span>
                <Badge variant="secondary" className="ml-1">
                  {categorizedWastes[category].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categorizedWastes[category].map((waste) => (
                  <Card key={waste._id?.toString()} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={getWasteImage(waste.name, waste.sector) || "/placeholder.svg"}
                        alt={waste.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(waste.status)}>{getStatusText(waste.status)}</Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">{waste.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Por {user.name}
                        <br />
                        {waste.quantity} {waste.unit}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{waste.composition}</p>

                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(waste.createdAt).toLocaleDateString("es-ES")}
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">{waste.location.address}</span>
                        </div>

                        {waste.routes && waste.routes.length > 0 && (
                          <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Rutas disponibles:</span>
                              <span className="font-medium text-green-600">{waste.routes.length}</span>
                            </div>

                            <div className="mt-1 flex items-center text-xs text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Mejor eficiencia: {Math.max(...waste.routes.map((r) => r.efficiency))}%
                            </div>
                          </div>
                        )}

                        <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          VERIFICAR
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <WasteRegistrationModal
        user={user}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onWasteRegistered={onWasteUpdate}
      />
    </>
  )
}
