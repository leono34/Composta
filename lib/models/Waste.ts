/**
 * Modelo de Residuo actualizado para MongoDB con imagen generada por IA
 */

import type { ObjectId } from "mongodb"

export interface ValorizationRoute {
  id: string
  name: string
  description: string
  efficiency: number
  co2Reduction: number
  estimatedValue: number
  processingTime: number
  requirements: string[]
}

export interface Waste {
  _id?: ObjectId
  userId: ObjectId
  name: string
  sector: string
  composition: string
  quantity: number
  unit: "kg" | "ton" | "litros" | "m3"
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  // Nueva propiedad para la imagen generada por IA
  generatedImage?: string
  images?: string[]
  routes: ValorizationRoute[]
  status: "registered" | "processing" | "valorized" | "completed"
  userType: "persona" | "empresa"
  // Información adicional para empresas
  companyInfo?: {
    department: string
    contactPerson: string
    urgency: "baja" | "media" | "alta" | "critica"
  }
  createdAt: Date
  updatedAt: Date
  processedAt?: Date
}

export interface WasteRegistration {
  name: string
  sector: string
  composition: string
  quantity: number
  unit: "kg" | "ton" | "litros" | "m3"
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  userType: "persona" | "empresa"
  companyInfo?: {
    department: string
    contactPerson: string
    urgency: "baja" | "media" | "alta" | "critica"
  }
  images?: string[]
}

/**
 * Validaciones para el modelo Waste
 */
export const validateWaste = (wasteData: Partial<Waste>): string[] => {
  const errors: string[] = []

  if (!wasteData.name || wasteData.name.trim().length < 2) {
    errors.push("El nombre del residuo debe tener al menos 2 caracteres")
  }

  if (!wasteData.sector) {
    errors.push("El sector de origen es requerido")
  }

  if (!wasteData.composition || wasteData.composition.trim().length < 10) {
    errors.push("La composición debe tener al menos 10 caracteres")
  }

  if (!wasteData.quantity || wasteData.quantity <= 0) {
    errors.push("La cantidad debe ser mayor a 0")
  }

  if (!wasteData.unit || !["kg", "ton", "litros", "m3"].includes(wasteData.unit)) {
    errors.push("Unidad de medida inválida")
  }

  if (!wasteData.location?.address || wasteData.location.address.trim().length < 5) {
    errors.push("La dirección debe tener al menos 5 caracteres")
  }

  if (!wasteData.userType || !["persona", "empresa"].includes(wasteData.userType)) {
    errors.push("Tipo de usuario inválido")
  }

  return errors
}
