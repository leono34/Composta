import { type NextRequest, NextResponse } from "next/server"
import { getWastesByUser } from "@/lib/services/wasteService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    // Obtener residuos del usuario
    const wastes = await getWastesByUser(userId)

    return NextResponse.json({
      success: true,
      wastes,
    })
  } catch (error) {
    console.error("Error getting user wastes:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
