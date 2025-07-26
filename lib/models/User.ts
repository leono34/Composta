/**
 * Modelo de Usuario actualizado para MongoDB
 */

import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  userType: "persona" | "empresa"
  // Campos específicos para personas
  phone?: string
  address?: string
  // Campos específicos para empresas
  companyName?: string
  sector?: string
  rfc?: string
  contactPerson?: string
  // Campo para foto de perfil
  profileImage?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface UserRegistration {
  name: string
  email: string
  password: string
  userType: "persona" | "empresa"
  phone?: string
  address?: string
  companyName?: string
  sector?: string
  rfc?: string
  contactPerson?: string
}

export interface UserLogin {
  email: string
  password: string
  userType: "persona" | "empresa"
}

export interface UserUpdate {
  name?: string
  email?: string
  phone?: string
  address?: string
  companyName?: string
  sector?: string
  rfc?: string
  contactPerson?: string
  profileImage?: string
}

/**
 * Validaciones para el modelo User
 */
export const validateUser = (userData: Partial<User>): string[] => {
  const errors: string[] = []

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres")
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push("Email inválido")
  }

  if (userData.password && userData.password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres")
  }

  if (!userData.userType || !["persona", "empresa"].includes(userData.userType)) {
    errors.push("Tipo de usuario inválido")
  }

  // Validaciones específicas para empresas
  if (userData.userType === "empresa") {
    if (!userData.companyName || userData.companyName.trim().length < 2) {
      errors.push("El nombre de la empresa es requerido")
    }
  }

  return errors
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
