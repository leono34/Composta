import { type NextRequest, NextResponse } from "next/server"
import { getTraceabilityByWasteId } from "@/lib/services/traceabilityService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const wasteId = params.id

    if (!wasteId) {
      return NextResponse.json({ success: false, error: "Waste ID is required" }, { status: 400 })
    }

    const traceability = await getTraceabilityByWasteId(wasteId)

    if (!traceability) {
      return NextResponse.json({ success: false, error: "Traceability not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      traceability,
    })
  } catch (error) {
    console.error("Error getting traceability:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
