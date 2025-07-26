import { type NextRequest, NextResponse } from "next/server"
import { getValorizationRoutes } from "@/lib/ai-algorithm"

export async function POST(request: NextRequest) {
  try {
    const wasteData = await request.json()

    // Simular procesamiento de IA
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Obtener rutas de valorización usando el algoritmo dummy
    const routes = getValorizationRoutes(wasteData)

    // Simular guardado en base de datos
    const wasteRecord = {
      id: `waste_${Date.now()}`,
      ...wasteData,
      createdAt: new Date().toISOString(),
      routes: routes,
    }

    console.log("Residuo registrado:", wasteRecord)

    return NextResponse.json({
      success: true,
      wasteId: wasteRecord.id,
      routes: routes,
    })
  } catch (error) {
    console.error("Error analyzing waste:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
