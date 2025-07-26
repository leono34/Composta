import { type NextRequest, NextResponse } from "next/server"
import { updateTraceabilityStep } from "@/lib/services/traceabilityService"

export async function POST(request: NextRequest) {
  try {
    const { traceabilityId, stepId, status, date } = await request.json()

    if (!traceabilityId || !stepId || !status) {
      return NextResponse.json(
        { success: false, error: "traceabilityId, stepId, and status are required" },
        { status: 400 },
      )
    }

    const success = await updateTraceabilityStep(traceabilityId, stepId, status, date ? new Date(date) : undefined)

    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to update traceability step" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Traceability step updated successfully",
    })
  } catch (error) {
    console.error("Error updating traceability step:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
