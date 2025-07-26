"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { WasteList } from "@/components/dashboard/waste-list"
import { ProfileHeader } from "@/components/dashboard/profile-header"
import type { User } from "@/lib/models/User"
import type { Waste } from "@/lib/models/Waste"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [wastes, setWastes] = useState<Waste[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadUserWastes(parsedUser._id)
    } else {
      // Redirigir al login si no hay usuario
      window.location.href = "/login"
    }
  }, [])

  const loadUserWastes = async (userId: string) => {
    try {
      const response = await fetch(`/api/waste/user/${userId}`)
      const data = await response.json()

      if (data.success) {
        setWastes(data.wastes)
      }
    } catch (error) {
      console.error("Error loading wastes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar user={user} onUserUpdate={handleUserUpdate} />

      {/* Contenido Principal */}
      <div className="flex-1 ml-64">
        <ProfileHeader user={user} />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Mis Residuos Registrados</h1>
              <p className="text-gray-600">Gestiona y revisa todos los residuos que has registrado</p>
            </div>

            <WasteList wastes={wastes} onWasteUpdate={() => loadUserWastes(user._id!)} />
          </div>
        </main>
      </div>
    </div>
  )
}
