// app/api/pruebas/route.ts
// import { testConnection } from "@/lib/mongodb" // Usa "@" si tienes path alias, si no, usa una ruta relativa correcta
// import { NextResponse } from "next/server"

// export async function GET() {
//   const ok = await testConnection()
//   return NextResponse.json({ connected: ok }, { status: ok ? 200 : 500 })
// }

// app/api/pruebas/route.ts
import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const db = await getDatabase()
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    return NextResponse.json({ message: "✅ Login exitoso", user: { email: user.email } })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
//


