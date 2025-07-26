import type { ObjectId } from "mongodb"

export interface TraceabilityStep {
  id: string
  title: string
  description: string
  date: Date | null
  status: "completed" | "current" | "pending"
  location: string
  responsible: string
  estimatedDuration?: string
  requirements?: string[]
  environmentalImpact?: {
    co2Reduction: number
    energySaved: number
    waterSaved: number
  }
}

export interface Material {
  type: string
  percentage: number
  recyclable: boolean
}

export interface ValorizationPoint {
  name: string
  location: string
  capacity: string
  specialization: string[]
  distance: number
}

export interface EnvironmentalImpact {
  co2Avoided: number
  energySaved: number
  waterSaved: number
  wasteReduced: number
}

export interface ProductInfo {
  name: string
  category: string
  materials: Material[]
  carbonFootprint: number
  recycledContent: number
  estimatedLifespan: number
}

export interface Traceability {
  _id?: ObjectId
  wasteId: ObjectId
  userId: ObjectId
  qrCode: string
  currentStep: number
  steps: TraceabilityStep[]
  productInfo: ProductInfo
  valorizationPoints: ValorizationPoint[]
  impact: EnvironmentalImpact
  recommendations: string[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export const TraceabilitySchema = {
  wasteId: { type: "ObjectId", required: true },
  userId: { type: "ObjectId", required: true },
  qrCode: { type: "string", required: true, unique: true },
  currentStep: { type: "number", default: 0 },
  steps: [
    {
      id: { type: "string", required: true },
      title: { type: "string", required: true },
      description: { type: "string", required: true },
      date: { type: "date", default: null },
      status: { type: "string", enum: ["completed", "current", "pending"], default: "pending" },
      location: { type: "string", required: true },
      responsible: { type: "string", required: true },
      estimatedDuration: { type: "string" },
      requirements: [{ type: "string" }],
      environmentalImpact: {
        co2Reduction: { type: "number", default: 0 },
        energySaved: { type: "number", default: 0 },
        waterSaved: { type: "number", default: 0 },
      },
    },
  ],
  productInfo: {
    name: { type: "string", required: true },
    category: { type: "string", required: true },
    materials: [
      {
        type: { type: "string", required: true },
        percentage: { type: "number", required: true },
        recyclable: { type: "boolean", required: true },
      },
    ],
    carbonFootprint: { type: "number", required: true },
    recycledContent: { type: "number", required: true },
    estimatedLifespan: { type: "number", required: true },
  },
  valorizationPoints: [
    {
      name: { type: "string", required: true },
      location: { type: "string", required: true },
      capacity: { type: "string", required: true },
      specialization: [{ type: "string" }],
      distance: { type: "number", required: true },
    },
  ],
  impact: {
    co2Avoided: { type: "number", required: true },
    energySaved: { type: "number", required: true },
    waterSaved: { type: "number", required: true },
    wasteReduced: { type: "number", required: true },
  },
  recommendations: [{ type: "string" }],
  createdAt: { type: "date", default: Date.now },
  updatedAt: { type: "date", default: Date.now },
  completedAt: { type: "date", default: null },
}
