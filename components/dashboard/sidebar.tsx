"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Camera, LogOut, Recycle, BarChart3, FileText, MapPin } from "lucide-react"
import Link from "next/link"
import { EditProfileModal } from "./edit-profile-modal"
import { PhotoUploadModal } from "./photo-upload-modal"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import type { User as UserType } from "@/lib/models/User"

interface SidebarProps {
  user: UserType
  onUserUpdate: (user: UserType) => void
}

export function Sidebar({ user, onUserUpdate }: SidebarProps) {
  const { t } = useLanguage()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    {
      icon: <Recycle className="h-5 w-5" />,
      label: t("dashboard"),
      href: "/dashboard",
      active: true,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: t("registerWaste"),
      onClick: () => {
        // Esta funcionalidad ahora se maneja desde el dashboard
        // No necesitamos navegar a otra página
      },
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: t("traceability"),
      href: "/traceability",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: t("environmentalImpact"),
      href: "/impact",
    },
  ]

  return (
    <>
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col z-50">
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Recycle className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">EcoCycle XR</span>
          </div>
          <LanguageSelector />
        </div>

        {/* Perfil del Usuario */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-green-100 text-green-600 text-lg font-semibold">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowPhotoUpload(true)}
                className="absolute -bottom-1 -right-1 bg-green-600 hover:bg-green-700 text-white rounded-full p-1.5 shadow-lg transition-colors"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{user.email}</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.userType === "empresa" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              }`}
            >
              {user.userType === "empresa" ? t("company") : t("person")}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => setShowEditProfile(true)}
            >
              <User className="h-4 w-4 mr-2" />
              {t("edit")} {t("person")}
            </Button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>

      {/* Modales */}
      <EditProfileModal
        user={user}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onUserUpdate={onUserUpdate}
      />

      <PhotoUploadModal
        user={user}
        isOpen={showPhotoUpload}
        onClose={() => setShowPhotoUpload(false)}
        onUserUpdate={onUserUpdate}
      />
    </>
  )
}
