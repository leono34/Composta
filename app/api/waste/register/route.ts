import { type NextRequest, NextResponse } from "next/server"
import { registerWaste } from "@/lib/services/wasteService"

export async function POST(request: NextRequest) {
  try {
    const wasteData = await request.json()
    const { userId, ...wasteInfo } = wasteData

    if (!userId) {
      return NextResponse.json({ success: false, errors: ["Usuario requerido"] }, { status: 400 })
    }

    // Registrar el residuo
    const result = await registerWaste(userId, wasteInfo)

    if (!result.success) {
      return NextResponse.json({ success: false, errors: result.errors }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      wasteId: result.waste?._id,
      waste: result.waste,
    })
  } catch (error) {
    console.error("Error registering waste:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
