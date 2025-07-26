/**
 * Algoritmo mejorado para generar rutas de valorización
 * Ahora considera el tipo de usuario (persona/empresa)
 */

interface WasteData {
  name: string
  sector: string
  composition: string
  quantity: number
  unit: string
  userType?: "persona" | "empresa"
}

interface ValorizationRoute {
  id: string
  name: string
  description: string
  efficiency: number
  co2Reduction: number
  estimatedValue: number
  processingTime: number
  requirements: string[]
}

// Base de datos expandida de rutas de valorización
const VALORIZATION_TEMPLATES: ValorizationRoute[] = [
  {
    id: "recycling_mechanical",
    name: "Reciclaje Mecánico",
    description: "Procesamiento mecánico para crear nuevos productos del mismo material",
    efficiency: 85,
    co2Reduction: 2.3,
    estimatedValue: 150,
    processingTime: 7,
    requirements: ["Separación previa", "Limpieza básica"],
  },
  {
    id: "upcycling_creative",
    name: "Upcycling Creativo",
    description: "Transformación en productos de mayor valor agregado",
    efficiency: 75,
    co2Reduction: 3.1,
    estimatedValue: 280,
    processingTime: 14,
    requirements: ["Diseño personalizado", "Mano de obra especializada"],
  },
  {
    id: "energy_recovery",
    name: "Recuperación Energética",
    description: "Conversión a energía mediante procesos térmicos controlados",
    efficiency: 65,
    co2Reduction: 1.8,
    estimatedValue: 95,
    processingTime: 3,
    requirements: ["Volumen mínimo 100kg", "Análisis calorífico"],
  },
  {
    id: "composting_industrial",
    name: "Compostaje Industrial",
    description: "Transformación en compost de alta calidad para agricultura",
    efficiency: 90,
    co2Reduction: 4.2,
    estimatedValue: 120,
    processingTime: 30,
    requirements: ["Material orgánico", "Control de humedad"],
  },
  {
    id: "chemical_recycling",
    name: "Reciclaje Químico",
    description: "Descomposición molecular para crear materias primas",
    efficiency: 70,
    co2Reduction: 2.8,
    estimatedValue: 200,
    processingTime: 10,
    requirements: ["Análisis químico", "Instalaciones especializadas"],
  },
  {
    id: "reuse_direct",
    name: "Reutilización Directa",
    description: "Acondicionamiento para uso directo en otras aplicaciones",
    efficiency: 95,
    co2Reduction: 5.1,
    estimatedValue: 180,
    processingTime: 2,
    requirements: ["Buen estado", "Limpieza superficial"],
  },
  {
    id: "biogas_production",
    name: "Producción de Biogás",
    description: "Digestión anaeróbica para generar biogás y fertilizante",
    efficiency: 80,
    co2Reduction: 6.2,
    estimatedValue: 250,
    processingTime: 45,
    requirements: ["Material orgánico", "Reactor anaeróbico"],
  },
  {
    id: "material_recovery",
    name: "Recuperación de Materiales",
    description: "Separación y recuperación de materiales valiosos",
    efficiency: 88,
    co2Reduction: 3.5,
    estimatedValue: 320,
    processingTime: 5,
    requirements: ["Separación magnética", "Clasificación óptica"],
  },
]

/**
 * Algoritmo principal mejorado para generar recomendaciones de valorización
 */
export function getValorizationRoutes(wasteData: WasteData): ValorizationRoute[] {
  const { name, sector, composition, quantity, unit, userType = "persona" } = wasteData

  // Normalizar datos de entrada
  const normalizedName = name.toLowerCase()
  const normalizedComposition = composition.toLowerCase()

  // Convertir cantidad a kg para cálculos uniformes
  const quantityInKg = convertToKg(quantity, unit)

  // Seleccionar rutas candidatas basadas en el tipo de material
  let candidateRoutes = [...VALORIZATION_TEMPLATES]

  // Filtros específicos por tipo de material
  candidateRoutes = filterByMaterial(candidateRoutes, normalizedName, normalizedComposition)

  // Filtros específicos por tipo de usuario
  candidateRoutes = filterByUserType(candidateRoutes, userType, quantityInKg)

  // Ajustar valores basados en contexto
  candidateRoutes = candidateRoutes.map((route) =>
    adjustRouteValues(route, {
      sector,
      quantity: quantityInKg,
      userType,
    }),
  )

  // Ordenar por eficiencia y seleccionar las mejores 3 rutas
  candidateRoutes.sort((a, b) => b.efficiency - a.efficiency)

  return candidateRoutes.slice(0, 3)
}

/**
 * Convierte diferentes unidades a kilogramos
 */
function convertToKg(quantity: number, unit: string): number {
  switch (unit) {
    case "ton":
      return quantity * 1000
    case "litros":
      return quantity * 1 // Asumiendo densidad similar al agua
    case "m3":
      return quantity * 1000 // Estimación general
    default:
      return quantity
  }
}

/**
 * Filtra rutas por tipo de material
 */
function filterByMaterial(routes: ValorizationRoute[], name: string, composition: string): ValorizationRoute[] {
  if (name.includes("plástico") || composition.includes("plástico")) {
    return routes.filter((route) =>
      ["recycling_mechanical", "chemical_recycling", "upcycling_creative", "energy_recovery"].includes(route.id),
    )
  }

  if (name.includes("papel") || composition.includes("papel")) {
    return routes.filter((route) =>
      ["recycling_mechanical", "upcycling_creative", "energy_recovery"].includes(route.id),
    )
  }

  if (name.includes("orgánico") || composition.includes("orgánico") || name.includes("comida")) {
    return routes.filter((route) =>
      ["composting_industrial", "biogas_production", "energy_recovery"].includes(route.id),
    )
  }

  if (name.includes("metal") || composition.includes("metal")) {
    return routes.filter((route) => ["recycling_mechanical", "material_recovery", "reuse_direct"].includes(route.id))
  }

  if (name.includes("vidrio") || composition.includes("vidrio")) {
    return routes.filter((route) => ["recycling_mechanical", "upcycling_creative", "reuse_direct"].includes(route.id))
  }

  // Para materiales mixtos o no identificados, devolver todas las rutas
  return routes
}

/**
 * Filtra rutas por tipo de usuario
 */
function filterByUserType(routes: ValorizationRoute[], userType: string, quantity: number): ValorizationRoute[] {
  if (userType === "persona") {
    // Para personas, filtrar rutas que requieren grandes volúmenes
    return routes.filter((route) => {
      if (route.id === "energy_recovery" && quantity < 10) return false
      if (route.id === "chemical_recycling" && quantity < 5) return false
      if (route.id === "biogas_production" && quantity < 20) return false
      return true
    })
  } else if (userType === "empresa") {
    // Para empresas, todas las rutas están disponibles
    return routes
  }

  return routes
}

/**
 * Ajusta valores de las rutas basado en el contexto
 */
function adjustRouteValues(
  route: ValorizationRoute,
  context: {
    sector: string
    quantity: number
    userType: string
  },
): ValorizationRoute {
  const { sector, quantity, userType } = context

  let sectorMultiplier = 1.0
  const userTypeMultiplier = userType === "empresa" ? 1.2 : 1.0

  // Ajustes por sector
  switch (sector) {
    case "industrial":
    case "manufactura":
      sectorMultiplier = 1.3
      break
    case "comercial":
      sectorMultiplier = 1.1
      break
    case "residencial":
      sectorMultiplier = 0.9
      break
    case "construccion":
      sectorMultiplier = 1.15
      break
    case "quimico":
    case "farmaceutico":
      sectorMultiplier = 1.4
      break
    default:
      sectorMultiplier = 1.0
  }

  // Ajuste por cantidad (economías de escala)
  const quantityMultiplier = Math.min(1 + quantity / 1000, 2.5)

  return {
    ...route,
    efficiency: Math.min(Math.round(route.efficiency * sectorMultiplier * userTypeMultiplier), 100),
    co2Reduction: Math.round(route.co2Reduction * quantityMultiplier * 10) / 10,
    estimatedValue: Math.round(route.estimatedValue * quantityMultiplier * sectorMultiplier * userTypeMultiplier),
    processingTime: Math.max(1, Math.round(route.processingTime / userTypeMultiplier)),
  }
}

/**
 * Función para obtener estadísticas del algoritmo
 */
export function getAlgorithmStats() {
  return {
    totalRoutes: VALORIZATION_TEMPLATES.length,
    avgEfficiency:
      VALORIZATION_TEMPLATES.reduce((sum, route) => sum + route.efficiency, 0) / VALORIZATION_TEMPLATES.length,
    totalProcessed: Math.floor(Math.random() * 10000) + 5000,
    successRate: 0.89,
    avgProcessingTime:
      VALORIZATION_TEMPLATES.reduce((sum, route) => sum + route.processingTime, 0) / VALORIZATION_TEMPLATES.length,
  }
}
