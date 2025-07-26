import { type NextRequest, NextResponse } from "next/server"
import { updateUser, getUserById } from "@/lib/services/userService"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profileImage } = await request.json()
    const userId = params.id

    if (!profileImage) {
      return NextResponse.json({ success: false, error: "Imagen requerida" }, { status: 400 })
    }

    // Actualizar foto de perfil
    const success = await updateUser(userId, {
      profileImage,
      updatedAt: new Date(),
    })

    if (!success) {
      return NextResponse.json({ success: false, error: "Error al actualizar foto" }, { status: 400 })
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
    console.error("Error updating user photo:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
