"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Leaf, Recycle, Users } from "lucide-react"
import Link from "next/link"
import Chart from "chart.js/auto"

export default function ImpactPage() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Destruir gráfico anterior si existe
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Crear nuevo gráfico
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
            datasets: [
              {
                label: "CO2 Evitado (kg)",
                data: [120, 190, 300, 500, 720, 890],
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Residuos Procesados (kg)",
                data: [80, 150, 250, 400, 580, 750],
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Impacto Ambiental Acumulado 2024",
              },
              legend: {
                position: "top" as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Cantidad",
                },
              },
            },
          },
        })
      }
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  const impactStats = [
    {
      title: "CO2 Total Evitado",
      value: "890 kg",
      change: "+23%",
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      description: "Equivalente a plantar 40 árboles",
    },
    {
      title: "Residuos Procesados",
      value: "750 kg",
      change: "+18%",
      icon: <Recycle className="h-6 w-6 text-blue-600" />,
      description: "Material desviado de vertederos",
    },
    {
      title: "Usuarios Activos",
      value: "1,234",
      change: "+45%",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      description: "Contribuyendo al cambio",
    },
    {
      title: "Valor Generado",
      value: "$12,450",
      change: "+32%",
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      description: "Valor económico creado",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Impacto Ambiental</h1>
          <p className="text-gray-600">Visualiza el impacto positivo generado por la plataforma EcoCycle XR</p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span>vs mes anterior</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tendencia de Impacto</CardTitle>
              <CardDescription>Evolución mensual del CO2 evitado y residuos procesados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <canvas ref={chartRef} />
              </div>
            </CardContent>
          </Card>

          {/* Panel de Métricas Adicionales */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logros Recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Meta de CO2 alcanzada</p>
                    <p className="text-xs text-gray-500">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">1000+ usuarios registrados</p>
                    <p className="text-xs text-gray-500">Hace 1 semana</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Nueva ruta de valorización</p>
                    <p className="text-xs text-gray-500">Hace 2 semanas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximas Metas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CO2 Evitado</span>
                    <span>89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "89%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Meta: 1000 kg CO2</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Usuarios Activos</span>
                    <span>62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Meta: 2000 usuarios</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
