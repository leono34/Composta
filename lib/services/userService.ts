/**
 * Servicio actualizado para gestión de usuarios con MongoDB
 */

import { getDatabase } from "@/lib/mongodb"
import { type User, type UserRegistration, type UserLogin, type UserUpdate, validateUser } from "@/lib/models/User"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

const COLLECTION_NAME = "users"

/**
 * Registra un nuevo usuario
 */
export async function registerUser(
  userData: UserRegistration,
): Promise<{ success: boolean; user?: User; errors?: string[] }> {
  try {
    // Validar datos
    const errors = validateUser(userData as User)
    if (errors.length > 0) {
      return { success: false, errors }
    }

    const db = await getDatabase()
    const collection = db.collection<User>(COLLECTION_NAME)

    // Verificar si el email ya existe
    const existingUser = await collection.findOne({ email: userData.email })
    if (existingUser) {
      return { success: false, errors: ["El email ya está registrado"] }
    }

    // Hashear contraseña con bcryptjs
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Crear usuario
    const newUser: User = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    const result = await collection.insertOne(newUser)

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = newUser

    return {
      success: true,
      user: { ...userWithoutPassword, _id: result.insertedId },
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, errors: ["Error interno del servidor"] }
  }
}

/**
 * Autentica un usuario
 */
export async function loginUser(
  loginData: UserLogin,
): Promise<{ success: boolean; user?: Omit<User, "password">; error?: string }> {
  try {
    const db = await getDatabase()
    const collection = db.collection<User>(COLLECTION_NAME)

    // Buscar usuario por email y tipo
    const user = await collection.findOne({
      email: loginData.email,
      userType: loginData.userType,
      isActive: true,
    })

    if (!user) {
      return { success: false, error: "Credenciales inválidas" }
    }

    // Verificar contraseña con bcryptjs
    const isValidPassword = await bcrypt.compare(loginData.password, user.password)
    if (!isValidPassword) {
      return { success: false, error: "Credenciales inválidas" }
    }

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = user

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error("Error logging in user:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    const collection = db.collection<User>(COLLECTION_NAME)

    const user = await collection.findOne({ _id: new ObjectId(userId) })
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

/**
 * Actualiza un usuario
 */
export async function updateUser(userId: string, updateData: UserUpdate): Promise<boolean> {
  try {
    const db = await getDatabase()
    const collection = db.collection<User>(COLLECTION_NAME)

    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

/**
 * Obtiene estadísticas de usuarios
 */
export async function getUserStats(): Promise<{
  total: number
  empresas: number
  personas: number
  activeThisMonth: number
}> {
  try {
    const db = await getDatabase()
    const collection = db.collection<User>(COLLECTION_NAME)

    const [totalResult, typeResult] = await Promise.all([
      collection.countDocuments({ isActive: true }),
      collection
        .aggregate([{ $match: { isActive: true } }, { $group: { _id: "$userType", count: { $sum: 1 } } }])
        .toArray(),
    ])

    const typeStats: Record<string, number> = {}
    typeResult.forEach((item) => {
      typeStats[item._id] = item.count
    })

    return {
      total: totalResult,
      empresas: typeStats.empresa || 0,
      personas: typeStats.persona || 0,
      activeThisMonth: Math.floor(totalResult * 0.7), // Simulado
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return { total: 0, empresas: 0, personas: 0, activeThisMonth: 0 }
  }
}
