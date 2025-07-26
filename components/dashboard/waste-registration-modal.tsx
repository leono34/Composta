"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, X, Building, User, Palette } from "lucide-react"
import { getAvailableSectors } from "@/lib/services/imageService"
import type { User as UserType } from "@/lib/models/User"

interface WasteRegistrationModalProps {
  user: UserType
  isOpen: boolean
  onClose: () => void
  onWasteRegistered: () => void
}

interface WasteFormData {
  name: string
  sector: string
  composition: string
  quantity: number
  unit: string
  location: {
    address: string
  }
  // Campos específicos para empresas
  companyInfo?: {
    department: string
    contactPerson: string
    urgency: string
  }
}

export function WasteRegistrationModal({ user, isOpen, onClose, onWasteRegistered }: WasteRegistrationModalProps) {
  const [formData, setFormData] = useState<WasteFormData>({
    name: "",
    sector: user.userType === "empresa" ? "industrial" : "residencial",
    composition: "",
    quantity: 0,
    unit: "kg",
    location: {
      address: user.address || "",
    },
    ...(user.userType === "empresa" && {
      companyInfo: {
        department: "",
        contactPerson: user.name,
        urgency: "media",
      },
    }),
  })
  const [loading, setLoading] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)

  const availableSectors = getAvailableSectors(user.userType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratingImage(true)

    try {
      const response = await fetch("/api/waste/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType: user.userType,
          userId: user._id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Resetear formulario
        setFormData({
          name: "",
          sector: user.userType === "empresa" ? "industrial" : "residencial",
          composition: "",
          quantity: 0,
          unit: "kg",
          location: { address: user.address || "" },
          ...(user.userType === "empresa" && {
            companyInfo: {
              department: "",
              contactPerson: user.name,
              urgency: "media",
            },
          }),
        })

        // Cerrar modal y actualizar lista
        onClose()
        onWasteRegistered()
      } else {
        alert(data.errors?.join(", ") || "Error al registrar residuo")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión")
    } finally {
      setLoading(false)
      setGeneratingImage(false)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {user.userType === "empresa" ? (
                <Building className="h-6 w-6 text-blue-600" />
              ) : (
                <User className="h-6 w-6 text-green-600" />
              )}
              <div>
                <DialogTitle className="text-xl">
                  Registrar Residuo - {user.userType === "empresa" ? "Empresa" : "Persona"}
                </DialogTitle>
                <DialogDescription className="flex items-center space-x-1">
                  <Palette className="h-4 w-4 text-blue-500" />
                  <span>Se generará una imagen automáticamente con Stability AI - Stable Diffusion</span>
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Residuo</Label>
            <Input
              id="name"
              type="text"
              placeholder={
                user.userType === "empresa"
                  ? "Ej: Aceites vegetales usados, Residuos metálicos..."
                  : "Ej: Botellas de plástico, Papel periódico..."
              }
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="sector">Sector</Label>
            <Select onValueChange={(value) => handleInputChange("sector", value)} value={formData.sector}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSectors.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="composition">
              {user.userType === "empresa" ? "Composición Técnica" : "Descripción y Composición"}
            </Label>
            <Textarea
              id="composition"
              placeholder={
                user.userType === "empresa"
                  ? "Ej: orgánico, aceites vegetales de cocina usados..."
                  : "Ej: plástico, botellas PET transparentes..."
              }
              value={formData.composition}
              onChange={(e) => handleInputChange("composition", e.target.value)}
              required
              rows={3}
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
                  {user.userType === "empresa" && <SelectItem value="ton">Toneladas</SelectItem>}
                  <SelectItem value="litros">Litros</SelectItem>
                  <SelectItem value="m3">Metros cúbicos (m³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">
              {user.userType === "empresa" ? "Dirección de la Empresa" : "Dirección de Recolección"}
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Dirección completa..."
              value={formData.location.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          {user.userType === "empresa" && (
            <>
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
            </>
          )}

          {generatingImage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="text-blue-800 font-medium">Generando imagen con Stability AI...</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Creando una imagen fotorrealística para "{formData.name}" usando Stable Diffusion
              </p>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${user.userType === "empresa" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {generatingImage ? "Generando con IA..." : "Registrando..."}
                </>
              ) : (
                <>
                  <Palette className="mr-2 h-4 w-4" />
                  Registrar con Stability AI
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
