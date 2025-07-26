import { type NextRequest, NextResponse } from "next/server"
import { getProductByQR } from "@/lib/services/productService"

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json()

    // Buscar producto en MongoDB
    const product = await getProductByQR(qrCode)

    if (!product) {
      return NextResponse.json({ success: false, error: "Código QR no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      id: product._id,
      name: product.name,
      qrCode: product.qrCode,
      manufacturer: product.manufacturer,
      currentStage: product.currentStage,
      stages: product.stages,
      valorizationPoints: product.valorizationPoints,
      carbonFootprint: product.carbonFootprint,
      recycledContent: product.recycledContent,
      estimatedLifespan: product.estimatedLifespan,
    })
  } catch (error) {
    console.error("Error tracking product:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
