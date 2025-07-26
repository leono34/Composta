/**
 * Utilidades de autenticación simuladas
 * En producción, esto se conectaría a un sistema de autenticación real
 */

interface User {
  id: string
  name: string
  email: string
  userType: "empresa" | "ciudadano"
  organization?: string
  createdAt: string
}

// Base de datos simulada de usuarios
const USERS_DB: User[] = [
  {
    id: "user_001",
    name: "Juan Pérez",
    email: "juan@email.com",
    userType: "ciudadano",
    createdAt: "2024-01-10",
  },
  {
    id: "user_002",
    name: "EcoTech Solutions",
    email: "admin@ecotech.com",
    userType: "empresa",
    organization: "manufactura",
    createdAt: "2024-01-15",
  },
]

/**
 * Autentica un usuario con email y contraseña
 */
export function authenticateUser(email: string, password: string, userType: string): User | null {
  // Simulación simple de autenticación
  // En producción, aquí se verificaría la contraseña hasheada

  const user = USERS_DB.find((u) => u.email === email && u.userType === userType)

  if (!user) {
    return null
  }

  // Simular verificación de contraseña
  if (password.length < 6) {
    return null
  }

  return user
}

/**
 * Crea un nuevo usuario en el sistema
 */
export function createUser(userData: any): User {
  const newUser: User = {
    id: `user_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    userType: userData.userType,
    organization: userData.organization,
    createdAt: new Date().toISOString(),
  }

  // En producción, esto se guardaría en la base de datos
  USERS_DB.push(newUser)

  return newUser
}

/**
 * Obtiene estadísticas de usuarios
 */
export function getUserStats() {
  return {
    totalUsers: USERS_DB.length,
    empresas: USERS_DB.filter((u) => u.userType === "empresa").length,
    ciudadanos: USERS_DB.filter((u) => u.userType === "ciudadano").length,
    activeThisMonth: Math.floor(USERS_DB.length * 0.7), // Simulado
  }
}
