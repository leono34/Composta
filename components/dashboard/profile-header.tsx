"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, User, MapPin, Phone, Mail } from "lucide-react"
import type { User as UserType } from "@/lib/models/User"

interface ProfileHeaderProps {
  user: UserType
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${user.userType === "empresa" ? "bg-blue-100" : "bg-green-100"}`}>
                  {user.userType === "empresa" ? (
                    <Building
                      className={`h-6 w-6 ${user.userType === "empresa" ? "text-blue-600" : "text-green-600"}`}
                    />
                  ) : (
                    <User className="h-6 w-6 text-green-600" />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Bienvenido, {user.name}</h2>
                  <p className="text-gray-600">
                    {user.userType === "empresa"
                      ? `${user.companyName || "Empresa"} - ${user.sector || "Sector no especificado"}`
                      : "Usuario personal"}
                  </p>
                </div>
              </div>

              <Badge variant={user.userType === "empresa" ? "default" : "secondary"}>
                {user.userType === "empresa" ? "Cuenta Empresarial" : "Cuenta Personal"}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}

              {user.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
