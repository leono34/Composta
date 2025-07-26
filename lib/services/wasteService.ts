/**
 * Servicio para gestión de residuos con MongoDB
 */

import { getDatabase } from "@/lib/mongodb"
import { type Waste, type WasteRegistration, validateWaste } from "@/lib/models/Waste"
import { getValorizationRoutes } from "@/lib/ai-algorithm"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = "wastes"

/**
 * Registra un nuevo residuo y obtiene rutas de valorización
 */
export async function registerWaste(
  userId: string,
  wasteData: WasteRegistration,
): Promise<{ success: boolean; waste?: Waste; errors?: string[] }> {
  try {
    // Validar datos
    const errors = validateWaste(wasteData as Waste)
    if (errors.length > 0) {
      return { success: false, errors }
    }

    const db = await getDatabase()
    const collection = db.collection<Waste>(COLLECTION_NAME)

    // Obtener rutas de valorización usando IA
    const routes = getValorizationRoutes(wasteData)

    // Crear registro de residuo
    const newWaste: Waste = {
      userId: new ObjectId(userId),
      ...wasteData,
      routes,
      status: "registered",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newWaste)

    return {
      success: true,
      waste: { ...newWaste, _id: result.insertedId },
    }
  } catch (error) {
    console.error("Error registering waste:", error)
    return { success: false, errors: ["Error interno del servidor"] }
  }
}

/**
 * Obtiene residuos por usuario
 */
export async function getWastesByUser(userId: string): Promise<Waste[]> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Waste>(COLLECTION_NAME)

    const wastes = await collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return wastes
  } catch (error) {
    console.error("Error getting wastes:", error)
    return []
  }
}

/**
 * Obtiene un residuo por ID
 */
export async function getWasteById(wasteId: string): Promise<Waste | null> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Waste>(COLLECTION_NAME)

    const waste = await collection.findOne({ _id: new ObjectId(wasteId) })
    return waste
  } catch (error) {
    console.error("Error getting waste:", error)
    return null
  }
}

/**
 * Actualiza el estado de un residuo
 */
export async function updateWasteStatus(wasteId: string, status: Waste["status"]): Promise<boolean> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Waste>(COLLECTION_NAME)

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (status === "processing") {
      updateData.processedAt = new Date()
    }

    const result = await collection.updateOne({ _id: new ObjectId(wasteId) }, { $set: updateData })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating waste status:", error)
    return false
  }
}

/**
 * Obtiene estadísticas de residuos
 */
export async function getWasteStats(): Promise<{
  total: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  totalQuantity: number
}> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Waste>(COLLECTION_NAME)

    const [totalResult, statusResult, quantityResult] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
      collection.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }]).toArray(),
    ])

    const byStatus: Record<string, number> = {}
    statusResult.forEach((item) => {
      byStatus[item._id] = item.count
    })

    return {
      total: totalResult,
      byStatus,
      byType: {}, // Se puede implementar después
      totalQuantity: quantityResult[0]?.total || 0,
    }
  } catch (error) {
    console.error("Error getting waste stats:", error)
    return { total: 0, byStatus: {}, byType: {}, totalQuantity: 0 }
  }
}
