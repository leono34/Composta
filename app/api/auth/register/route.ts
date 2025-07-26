import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/services/userService"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const result = await registerUser(userData)

    if (!result.success) {
      return NextResponse.json({ success: false, errors: result.errors }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error("Error during registration:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
