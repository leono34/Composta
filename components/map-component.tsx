"use client"

import { useEffect, useRef } from "react"

interface ValorizationPoint {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  distance: number
}

interface MapComponentProps {
  points: ValorizationPoint[]
}

export default function MapComponent({ points }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    // Simular carga de Leaflet (en un proyecto real, instalarías leaflet)
    const initMap = () => {
      if (mapRef.current && !mapInstance.current) {
        // Simulación de mapa con Leaflet
        // En un proyecto real, aquí inicializarías el mapa real
        console.log("Inicializando mapa con puntos:", points)
      }
    }

    initMap()
  }, [points])

  // Componente simulado del mapa
  return (
    <div
      ref={mapRef}
      className="h-64 bg-gray-200 rounded-lg relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e5e7eb' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Simulación de marcadores en el mapa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Mapa Interactivo</h3>
          <p className="text-sm text-gray-600 mb-3">Mostrando {points.length} puntos de valorización cercanos</p>
          <div className="space-y-2">
            {points.slice(0, 2).map((point) => (
              <div key={point.id} className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700">{point.name}</span>
                <span className="text-xs text-gray-500">({point.distance} km)</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">💡 En producción: Mapa interactivo con Leaflet/Google Maps</p>
        </div>
      </div>
    </div>
  )
}
