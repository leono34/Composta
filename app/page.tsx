import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Leaf, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Recycle className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EcoCycle XR</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Transformamos Residuos en <span className="text-green-600">Oportunidades</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            EcoCycle XR es una plataforma innovadora que utiliza inteligencia artificial para encontrar las mejores
            rutas de valorización para tus residuos, promoviendo la economía circular y reduciendo el impacto ambiental.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/waste-form">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Registrar Residuo
              </Button>
            </Link>
            <Link href="/traceability">
              <Button size="lg" variant="outline">
                Rastrear Producto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900">Funcionalidades Principales</h3>
            <p className="mt-4 text-lg text-gray-600">Descubre cómo EcoCycle XR revoluciona la gestión de residuos</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Recycle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>IA para Valorización</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Algoritmos inteligentes que identifican las mejores rutas de valorización para cada tipo de residuo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Trazabilidad Total</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seguimiento completo del ciclo de vida de productos desde fabricación hasta reciclaje.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Impacto Ambiental</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Métricas en tiempo real del CO2 evitado y beneficios ambientales generados.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Economía Circular</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Conectamos empresas y ciudadanos para crear un ecosistema sostenible de reutilización.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white">¿Listo para hacer la diferencia?</h3>
          <p className="mt-4 text-xl text-green-100">Únete a la revolución de la economía circular</p>
          <div className="mt-8">
            <Link href="/waste-form">
              <Button size="lg" variant="secondary">
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 EcoCycle XR. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
