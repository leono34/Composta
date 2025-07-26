import { type NextRequest, NextResponse } from "next/server"
import { updateUser, getUserById } from "@/lib/services/userService"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const userId = params.id

    // Actualizar usuario
    const success = await updateUser(userId, updateData)

    if (!success) {
      return NextResponse.json({ success: false, error: "Error al actualizar usuario" }, { status: 400 })
    }

    // Obtener usuario actualizado
    const updatedUser = await getUserById(userId)

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    // Remover contraseña de la respuesta
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
