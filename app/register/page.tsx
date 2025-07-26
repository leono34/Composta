"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Building } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    // Campos para persona
    phone: "",
    address: "",
    // Campos para empresa
    companyName: "",
    sector: "",
    rfc: "",
    contactPerson: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert("Cuenta creada exitosamente")
        window.location.href = "/login"
      } else {
        alert(data.errors?.join(", ") || "Error al crear la cuenta")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Únete a la comunidad EcoCycle XR</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa tus datos para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="userType">Tipo de Usuario</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, userType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu tipo de cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="persona">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Persona
                      </div>
                    </SelectItem>
                    <SelectItem value="empresa">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Empresa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">
                  {formData.userType === "empresa" ? "Nombre del Representante" : "Nombre Completo"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={formData.userType === "empresa" ? "Juan Pérez" : "Juan Pérez"}
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {formData.userType === "empresa" && (
                <>
                  <div>
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Mi Empresa S.A."
                      value={formData.companyName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sector">Sector Industrial</Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, sector: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufactura">Manufactura</SelectItem>
                        <SelectItem value="construccion">Construcción</SelectItem>
                        <SelectItem value="alimentario">Alimentario</SelectItem>
                        <SelectItem value="textil">Textil</SelectItem>
                        <SelectItem value="quimico">Químico</SelectItem>
                        <SelectItem value="farmaceutico">Farmacéutico</SelectItem>
                        <SelectItem value="automotriz">Automotriz</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rfc">RFC (Opcional)</Label>
                    <Input
                      id="rfc"
                      type="text"
                      placeholder="ABC123456789"
                      value={formData.rfc}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rfc: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {formData.userType === "persona" && (
                <>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="555-123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Calle, número, colonia, ciudad"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
