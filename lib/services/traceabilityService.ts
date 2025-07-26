import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { generateAITraceability } from "./aiTraceabilityService"
import type { Traceability } from "@/lib/models/Traceability"
import type { Waste } from "@/lib/models/Waste"
import type { User } from "@/lib/models/User"

export async function createTraceability(waste: Waste, user: User): Promise<Traceability | null> {
  try {
    const { db } = await connectToDatabase()

    // Generar trazabilidad con IA
    const aiData = await generateAITraceability(waste, user)

    const traceabilityData: Omit<Traceability, "_id"> = {
      wasteId: new ObjectId(waste._id),
      userId: new ObjectId(user._id),
      qrCode: aiData.qrCode,
      currentStep: 1, // Empezar en el paso 1 (registro completado)
      steps: aiData.steps,
      productInfo: aiData.productInfo,
      valorizationPoints: aiData.valorizationPoints,
      impact: aiData.impact,
      recommendations: aiData.recommendations,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("traceability").insertOne(traceabilityData)

    if (result.insertedId) {
      return {
        _id: result.insertedId,
        ...traceabilityData,
      }
    }

    return null
  } catch (error) {
    console.error("Error creating traceability:", error)
    return null
  }
}

export async function getTraceabilityByWasteId(wasteId: string): Promise<Traceability | null> {
  try {
    const { db } = await connectToDatabase()

    const traceability = await db.collection("traceability").findOne({
      wasteId: new ObjectId(wasteId),
    })

    return traceability as Traceability | null
  } catch (error) {
    console.error("Error getting traceability:", error)
    return null
  }
}

export async function updateTraceabilityStep(
  traceabilityId: string,
  stepId: string,
  status: "completed" | "current" | "pending",
  date?: Date,
): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()

    const updateData: any = {
      "steps.$.status": status,
      updatedAt: new Date(),
    }

    if (date) {
      updateData["steps.$.date"] = date
    }

    const result = await db.collection("traceability").updateOne(
      {
        _id: new ObjectId(traceabilityId),
        "steps.id": stepId,
      },
      { $set: updateData },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating traceability step:", error)
    return false
  }
}

export async function getTraceabilityByQR(qrCode: string): Promise<Traceability | null> {
  try {
    const { db } = await connectToDatabase()

    const traceability = await db.collection("traceability").findOne({
      qrCode: qrCode,
    })

    return traceability as Traceability | null
  } catch (error) {
    console.error("Error getting traceability by QR:", error)
    return null
  }
}

export async function getUserTraceabilities(userId: string): Promise<Traceability[]> {
  try {
    const { db } = await connectToDatabase()

    const traceabilities = await db
      .collection("traceability")
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return traceabilities as Traceability[]
  } catch (error) {
    console.error("Error getting user traceabilities:", error)
    return []
  }
}
