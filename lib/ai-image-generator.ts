/**
 * Generador de imágenes con IA para residuos
 * Utiliza placeholders inteligentes basados en el contenido
 */

interface WasteImageConfig {
  name: string
  sector: string
  composition?: string
  userType?: "persona" | "empresa"
}

/**
 * Genera una URL de imagen basada en el tipo de residuo
 */
export function generateWasteImage(config: WasteImageConfig): string {
  const { name, sector, composition, userType } = config

  // Crear query inteligente para la imagen
  let query = ""

  // Determinar el tipo de residuo basado en el nombre y composición
  const lowerName = name.toLowerCase()
  const lowerComposition = composition?.toLowerCase() || ""

  if (lowerName.includes("plástico") || lowerComposition.includes("plástico")) {
    query = "plastic waste recycling bottles containers"
  } else if (lowerName.includes("papel") || lowerComposition.includes("papel")) {
    query = "paper waste recycling documents cardboard"
  } else if (lowerName.includes("metal") || lowerComposition.includes("metal")) {
    query = "metal waste recycling aluminum steel scrap"
  } else if (lowerName.includes("vidrio") || lowerComposition.includes("vidrio")) {
    query = "glass waste recycling bottles jars"
  } else if (lowerName.includes("orgánico") || lowerName.includes("comida") || lowerComposition.includes("orgánico")) {
    query = "organic waste food scraps composting"
  } else if (lowerName.includes("electrónico") || lowerComposition.includes("electrónico")) {
    query = "electronic waste e-waste computers phones"
  } else if (lowerName.includes("textil") || lowerComposition.includes("textil")) {
    query = "textile waste clothing fabric recycling"
  } else if (lowerName.includes("químico") || lowerComposition.includes("químico")) {
    query = "chemical waste industrial hazardous materials"
  } else if (lowerName.includes("construcción") || lowerComposition.includes("construcción")) {
    query = "construction waste concrete debris materials"
  } else {
    // Query genérico basado en el sector
    switch (sector) {
      case "industrial":
      case "manufactura":
        query = "industrial waste factory manufacturing materials"
        break
      case "alimentario":
        query = "food waste organic kitchen scraps"
        break
      case "químico":
        query = "chemical waste laboratory industrial containers"
        break
      case "construcción":
        query = "construction waste building materials debris"
        break
      case "textil":
        query = "textile waste clothing fabric materials"
        break
      case "farmacéutico":
        query = "pharmaceutical waste medical containers"
        break
      case "automotriz":
        query = "automotive waste car parts oil filters"
        break
      case "residencial":
        query = "household waste domestic recycling materials"
        break
      default:
        query = `${name} waste recycling materials`
    }
  }

  // Agregar contexto del tipo de usuario
  if (userType === "empresa") {
    query += " industrial commercial large scale"
  } else {
    query += " household domestic small scale"
  }

  // Generar URL del placeholder con query específica
  return `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(query)}`
}

/**
 * Obtiene el color de categoría basado en el tipo de residuo
 */
export function getWasteCategoryColor(sector: string): string {
  switch (sector) {
    case "industrial":
    case "manufactura":
      return "bg-blue-100 text-blue-800"
    case "químico":
    case "farmacéutico":
      return "bg-red-100 text-red-800"
    case "alimentario":
      return "bg-green-100 text-green-800"
    case "construcción":
      return "bg-orange-100 text-orange-800"
    case "textil":
      return "bg-purple-100 text-purple-800"
    case "automotriz":
      return "bg-gray-100 text-gray-800"
    case "residencial":
      return "bg-emerald-100 text-emerald-800"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

/**
 * Genera sugerencias de nombres de residuos basado en el sector
 */
export function getWasteSuggestions(sector: string, userType: "persona" | "empresa"): string[] {
  if (userType === "persona") {
    return [
      "Botellas de plástico",
      "Papel y cartón",
      "Residuos orgánicos",
      "Vidrio y cristal",
      "Ropa y textiles",
      "Electrónicos pequeños",
      "Pilas y baterías",
      "Aceite de cocina",
    ]
  } else {
    switch (sector) {
      case "industrial":
      case "manufactura":
        return [
          "Residuos metálicos",
          "Plásticos industriales",
          "Solventes químicos",
          "Aceites industriales",
          "Materiales compuestos",
          "Residuos de producción",
        ]
      case "alimentario":
        return [
          "Residuos orgánicos",
          "Aceites vegetales",
          "Envases alimentarios",
          "Subproductos de procesamiento",
          "Materiales de empaque",
        ]
      case "químico":
        return [
          "Solventes usados",
          "Reactivos vencidos",
          "Contenedores químicos",
          "Residuos de laboratorio",
          "Materiales peligrosos",
        ]
      case "construcción":
        return [
          "Concreto y escombros",
          "Materiales metálicos",
          "Madera de construcción",
          "Materiales aislantes",
          "Residuos de demolición",
        ]
      default:
        return [
          "Residuos de oficina",
          "Materiales de empaque",
          "Equipos electrónicos",
          "Mobiliario usado",
          "Documentos confidenciales",
        ]
    }
  }
}
