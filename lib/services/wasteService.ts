/**
 * Servicio actualizado para gestión de residuos con trazabilidad automática
 */

import { getDatabase } from "@/lib/mongodb"
import { type Waste, type WasteRegistration, validateWaste } from "@/lib/models/Waste"
import { getValorizationRoutes } from "@/lib/ai-algorithm"
import { generateWasteImage } from "@/lib/services/imageService"
import { createTraceability } from "@/lib/services/traceabilityService"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = "wastes"

/**
 * Registra un nuevo residuo con generación automática de imagen y trazabilidad
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

    // Generar imagen con Stability AI
    console.log("🎨 Generando imagen con Stability AI para residuo:", wasteData.name)
    const generatedImageBase64 = await generateWasteImage(
      wasteData.name,
      wasteData.sector,
      wasteData.composition,
      wasteData.userType,
    )

    let finalImageUrl: string | undefined

    if (generatedImageBase64) {
      console.log("✅ Imagen generada exitosamente con Stability AI")
      finalImageUrl = generatedImageBase64
    } else {
      console.log("❌ No se pudo generar imagen, usando placeholder")
    }

    // Crear registro de residuo
    const newWaste: Waste = {
      userId: new ObjectId(userId),
      ...wasteData,
      generatedImage: finalImageUrl,
      routes,
      status: "registered",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newWaste)
    const wasteWithId = { ...newWaste, _id: result.insertedId }

    // Crear trazabilidad automáticamente
    console.log("📋 Creando registro de trazabilidad...")
    try {
      await createTraceability({
        wasteId: result.insertedId.toString(),
        userId: userId,
        productInfo: {
          name: wasteData.name,
          category: wasteData.sector,
          materials: [
            {
              type: wasteData.composition.split(",")[0]?.trim() || "Material mixto",
              percentage: 100,
              recyclable: true,
            },
          ],
          carbonFootprint: Math.round(Math.random() * 50 + 10),
          recycledContent: Math.round(Math.random() * 30),
          estimatedLifespan: Math.round(Math.random() * 24 + 6),
        },
        initialLocation: wasteData.location.address,
      })
      console.log("✅ Trazabilidad creada exitosamente")
    } catch (traceabilityError) {
      console.error("⚠️ Error creando trazabilidad:", traceabilityError)
      // No fallar el registro del residuo si falla la trazabilidad
    }

    return {
      success: true,
      waste: wasteWithId,
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
  bySector: Record<string, number>
  totalQuantity: number
  imagesGenerated: number
}> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Waste>(COLLECTION_NAME)

    const [totalResult, statusResult, sectorResult, quantityResult, imagesResult] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
      collection.aggregate([{ $group: { _id: "$sector", count: { $sum: 1 } } }]).toArray(),
      collection.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }]).toArray(),
      collection.countDocuments({ generatedImage: { $exists: true, $ne: null } }),
    ])

    const byStatus: Record<string, number> = {}
    statusResult.forEach((item) => {
      byStatus[item._id] = item.count
    })

    const bySector: Record<string, number> = {}
    sectorResult.forEach((item) => {
      bySector[item._id] = item.count
    })

    return {
      total: totalResult,
      byStatus,
      bySector,
      totalQuantity: quantityResult[0]?.total || 0,
      imagesGenerated: imagesResult,
    }
  } catch (error) {
    console.error("Error getting waste stats:", error)
    return { total: 0, byStatus: {}, bySector: {}, totalQuantity: 0, imagesGenerated: 0 }
  }
}
