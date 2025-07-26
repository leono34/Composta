"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, Upload, Loader2 } from "lucide-react"
import type { User } from "@/lib/models/User"

interface PhotoUploadModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onUserUpdate: (user: User) => void
}

export function PhotoUploadModal({ user, isOpen, onClose, onUserUpdate }: PhotoUploadModalProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida")
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB")
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!preview) return

    setLoading(true)

    try {
      // En un entorno real, aquí subirías la imagen a un servicio como Cloudinary, AWS S3, etc.
      // Por ahora, simularemos guardando la imagen en base64 (no recomendado para producción)

      const response = await fetch(`/api/user/update-photo/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileImage: preview,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onUserUpdate(data.user)
        setPreview(null)
        onClose()
      } else {
        alert(data.error || "Error al actualizar foto")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar Foto de Perfil</DialogTitle>
          <DialogDescription>Selecciona una nueva imagen para tu perfil</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={preview || user.profileImage} alt={user.name} />
              <AvatarFallback className="bg-green-100 text-green-600 text-2xl font-semibold">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Imagen
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Formatos soportados: JPG, PNG, GIF
              <br />
              Tamaño máximo: 5MB
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null)
                onClose()
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={!preview || loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
