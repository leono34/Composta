/**
 * Modelo de Producto para MongoDB (Trazabilidad)
 */

import type { ObjectId } from "mongodb"

export interface ProductStage {
  stage: "fabricacion" | "distribucion" | "uso" | "reciclaje"
  date: Date
  location: string
  description: string
  responsible: string
  coordinates?: {
    lat: number
    lng: number
  }
  documents?: string[]
}

export interface Product {
  _id?: ObjectId
  qrCode: string
  name: string
  category: string
  manufacturer: {
    name: string
    id: string
    contact: string
  }
  materials: {
    type: string
    percentage: number
    recyclable: boolean
  }[]
  carbonFootprint: number
  recycledContent: number
  estimatedLifespan: number
  currentStage: "fabricacion" | "distribucion" | "uso" | "reciclaje"
  stages: ProductStage[]
  valorizationPoints: {
    id: string
    name: string
    type: string
    coordinates: {
      lat: number
      lng: number
    }
    distance?: number
    services: string[]
  }[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Validaciones para el modelo Product
 */
export const validateProduct = (productData: Partial<Product>): string[] => {
  const errors: string[] = []

  if (!productData.qrCode || productData.qrCode.trim().length < 5) {
    errors.push("El código QR debe tener al menos 5 caracteres")
  }

  if (!productData.name || productData.name.trim().length < 2) {
    errors.push("El nombre del producto debe tener al menos 2 caracteres")
  }

  if (!productData.manufacturer?.name) {
    errors.push("El nombre del fabricante es requerido")
  }

  if (!productData.materials || productData.materials.length === 0) {
    errors.push("Debe especificar al menos un material")
  }

  return errors
}
