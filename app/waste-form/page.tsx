import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building, ArrowLeft } from "lucide-react"

export default function WasteFormSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Residuo</h1>
          <p className="text-gray-600">Selecciona tu tipo de usuario para continuar con el registro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Opción Persona */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Persona</CardTitle>
              <CardDescription>Para residuos domésticos y personales</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Residuos del hogar</li>
                <li>• Cantidades pequeñas</li>
                <li>• Proceso simplificado</li>
                <li>• Recolección local</li>
              </ul>
              <Link href="/waste-form/persona">
                <Button className="w-full bg-green-600 hover:bg-green-700">Continuar como Persona</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Opción Empresa */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Empresa</CardTitle>
              <CardDescription>Para residuos industriales y comerciales</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Residuos industriales</li>
                <li>• Grandes volúmenes</li>
                <li>• Análisis especializado</li>
                <li>• Gestión empresarial</li>
              </ul>
              <Link href="/waste-form/empresa">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Continuar como Empresa</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            ¿No estás seguro? Puedes cambiar de opción en cualquier momento durante el registro.
          </p>
        </div>
      </div>
    </div>
  )
}
