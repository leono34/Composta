import { type NextRequest, NextResponse } from "next/server"
import { createTraceability } from "@/lib/services/traceabilityService"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { wasteId, userId } = await request.json()

    if (!wasteId || !userId) {
      return NextResponse.json({ success: false, error: "wasteId and userId are required" }, { status: 400 })
    }

    // Obtener datos del residuo y usuario
    const { db } = await connectToDatabase()

    const waste = await db.collection("wastes").findOne({
      _id: new ObjectId(wasteId),
    })

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    })

    if (!waste || !user) {
      return NextResponse.json({ success: false, error: "Waste or user not found" }, { status: 404 })
    }

    // Crear trazabilidad con IA
    const traceability = await createTraceability(waste, user)

    if (!traceability) {
      return NextResponse.json({ success: false, error: "Failed to create traceability" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      traceability,
    })
  } catch (error) {
    console.error("Error in traceability creation:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
