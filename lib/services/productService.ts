/**
 * Servicio para gestión de productos y trazabilidad con MongoDB
 */

import { getDatabase } from "@/lib/mongodb"
import { type Product, validateProduct } from "@/lib/models/Product"

const COLLECTION_NAME = "products"

/**
 * Obtiene un producto por código QR
 */
export async function getProductByQR(qrCode: string): Promise<Product | null> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Product>(COLLECTION_NAME)

    const product = await collection.findOne({ qrCode })
    return product
  } catch (error) {
    console.error("Error getting product by QR:", error)
    return null
  }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(
  productData: Omit<Product, "_id" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
  try {
    // Validar datos
    const errors = validateProduct(productData)
    if (errors.length > 0) {
      return { success: false, errors }
    }

    const db = await getDatabase()
    const collection = db.collection<Product>(COLLECTION_NAME)

    // Verificar si el código QR ya existe
    const existingProduct = await collection.findOne({ qrCode: productData.qrCode })
    if (existingProduct) {
      return { success: false, errors: ["El código QR ya existe"] }
    }

    // Crear producto
    const newProduct: Product = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newProduct)

    return {
      success: true,
      product: { ...newProduct, _id: result.insertedId },
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, errors: ["Error interno del servidor"] }
  }
}

/**
 * Actualiza el estado de un producto
 */
export async function updateProductStage(
  qrCode: string,
  newStage: Product["currentStage"],
  stageData: {
    location: string
    description: string
    responsible: string
    coordinates?: { lat: number; lng: number }
  },
): Promise<boolean> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Product>(COLLECTION_NAME)

    const result = await collection.updateOne(
      { qrCode },
      {
        $set: {
          currentStage: newStage,
          updatedAt: new Date(),
        },
        $push: {
          stages: {
            stage: newStage,
            date: new Date(),
            ...stageData,
          },
        },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating product stage:", error)
    return false
  }
}

/**
 * Obtiene estadísticas de productos
 */
export async function getProductStats(): Promise<{
  total: number
  byStage: Record<string, number>
  avgLifespan: number
}> {
  try {
    const db = await getDatabase()
    const collection = db.collection<Product>(COLLECTION_NAME)

    const [totalResult, stageResult] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([{ $group: { _id: "$currentStage", count: { $sum: 1 } } }]).toArray(),
    ])

    const byStage: Record<string, number> = {}
    stageResult.forEach((item) => {
      byStage[item._id] = item.count
    })

    return {
      total: totalResult,
      byStage,
      avgLifespan: 18, // Calculado dinámicamente en el futuro
    }
  } catch (error) {
    console.error("Error getting product stats:", error)
    return { total: 0, byStage: {}, avgLifespan: 0 }
  }
}
