import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/services/userService"

export async function POST(request: NextRequest) {
  try {
    const loginData = await request.json()

    const result = await loginUser(loginData)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      userType: result.user?.userType,
      redirectTo: "/dashboard", // Redirigir al dashboard después del login
    })
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
