/**
 * Servicio para generación de imágenes con IA usando Stability AI - Stable Diffusion
 */

interface StabilityImageRequest {
  text_prompts: Array<{
    text: string
    weight?: number
  }>
  cfg_scale?: number
  height?: number
  width?: number
  samples?: number
  steps?: number
  style_preset?: string
}

interface StabilityImageResponse {
  artifacts: Array<{
    base64: string
    seed: number
    finishReason: string
  }>
}

/**
 * Genera una imagen usando Stability AI - Stable Diffusion basada en el residuo
 */
export async function generateWasteImage(
  name: string,
  sector: string,
  composition: string,
  userType: "persona" | "empresa",
): Promise<string | null> {
  try {
    // Crear prompt específico para el residuo
    const prompt = createWasteImagePrompt(name, sector, composition, userType)
    const negativePrompt = "people, humans, faces, hands, text, watermark, blurry, low quality, distorted"
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
          {
            text: negativePrompt,
            weight: -1,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
        style_preset: "photographic",
      }),
    })

    if (!response.ok) {
      console.error("Error generating image:", response.statusText)
      return null
    }

    const data: StabilityImageResponse = await response.json()

    if (data.artifacts && data.artifacts.length > 0) {
      // Convertir base64 a data URL
      const base64Image = data.artifacts[0].base64
      return `data:image/png;base64,${base64Image}`
    }

    return null
  } catch (error) {
    console.error("Error in generateWasteImage:", error)
    return null
  }
}

/**
 * Crea un prompt optimizado para Stable Diffusion para generar imágenes de residuos
 */
function createWasteImagePrompt(
  name: string,
  sector: string,
  composition: string,
  userType: "persona" | "empresa",
): string {
  const lowerName = name.toLowerCase()
  const lowerComposition = composition.toLowerCase()

  let basePrompt = ""
  let context = ""
  const style = "professional photography, high quality, detailed, clean background, well lit, realistic"

  // Determinar el tipo de residuo y crear prompt base
  if (lowerName.includes("plástico") || lowerComposition.includes("plástico")) {
    basePrompt = "plastic waste materials, recyclable plastic bottles and containers, clear plastic items"
  } else if (lowerName.includes("papel") || lowerComposition.includes("papel")) {
    basePrompt = "paper waste, recyclable paper documents, cardboard materials, white and brown paper"
  } else if (lowerName.includes("metal") || lowerComposition.includes("metal")) {
    basePrompt = "metal waste, aluminum cans, steel scraps, shiny metallic materials, recyclable metals"
  } else if (lowerName.includes("vidrio") || lowerComposition.includes("vidrio")) {
    basePrompt = "glass waste, transparent glass bottles and jars, recyclable glass materials"
  } else if (lowerName.includes("orgánico") || lowerName.includes("comida") || lowerComposition.includes("orgánico")) {
    basePrompt = "organic waste, food scraps, biodegradable materials, compostable organic matter"
  } else if (lowerName.includes("aceite")) {
    basePrompt = "used cooking oil in containers, yellow liquid oil waste, oil bottles and jugs"
  } else if (lowerName.includes("electrónico") || lowerComposition.includes("electrónico")) {
    basePrompt = "electronic waste, old computers and phones, circuit boards, e-waste components"
  } else if (lowerName.includes("textil") || lowerComposition.includes("textil")) {
    basePrompt = "textile waste, old clothes and fabric materials, colorful clothing items"
  } else if (lowerName.includes("químico") || lowerComposition.includes("químico")) {
    basePrompt = "chemical waste containers, industrial chemical bottles, hazardous material containers"
  } else if (lowerName.includes("construcción") || lowerComposition.includes("construcción")) {
    basePrompt = "construction waste, concrete debris, building materials, construction rubble"
  } else {
    // Prompt genérico basado en el nombre
    basePrompt = `${name} waste materials, recyclable items, waste management`
  }

  // Agregar contexto según el sector
  switch (sector) {
    case "industrial":
    case "manufactura":
      context = "industrial setting, organized waste collection, large scale materials"
      break
    case "alimentario":
      context = "food industry waste, kitchen environment, organic food materials"
      break
    case "químico":
    case "farmacéutico":
      context = "laboratory containers, scientific waste, chemical bottles"
      break
    case "construcción":
      context = "construction site materials, building debris, concrete and steel"
      break
    case "textil":
      context = "textile materials, fabric waste, clothing items"
      break
    case "automotriz":
      context = "automotive parts, mechanical components, car-related materials"
      break
    case "residencial":
    case "doméstico":
      context = "household waste, home environment, domestic materials"
      break
    case "comercial":
      context = "commercial waste, office materials, business environment"
      break
    default:
      context = "organized waste materials, clean environment"
  }

  // Agregar contexto del tipo de usuario
  if (userType === "empresa") {
    context += ", commercial scale, industrial organization, bulk materials"
  } else {
    context += ", household scale, domestic collection, small quantities"
  }

  // Construir prompt final optimizado para Stable Diffusion
  const finalPrompt = `${basePrompt}, ${context}, ${style}, waste management, recycling, environmental sustainability, clean composition, studio lighting, no text, no people`

  return finalPrompt
}

/**
 * Obtiene el color de categoría basado en el sector
 */
export function getSectorColor(sector: string): string {
  switch (sector) {
    case "industrial":
    case "manufactura":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "químico":
    case "farmacéutico":
      return "bg-red-100 text-red-800 border-red-200"
    case "alimentario":
      return "bg-green-100 text-green-800 border-green-200"
    case "construcción":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "textil":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "automotriz":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "residencial":
    case "doméstico":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "comercial":
      return "bg-cyan-100 text-cyan-800 border-cyan-200"
    default:
      return "bg-slate-100 text-slate-800 border-slate-200"
  }
}

/**
 * Obtiene sectores disponibles según el tipo de usuario
 */
export function getAvailableSectors(userType: "persona" | "empresa"): Array<{ value: string; label: string }> {
  if (userType === "persona") {
    return [
      { value: "residencial", label: "Residencial" },
      { value: "doméstico", label: "Doméstico" },
      { value: "comercial", label: "Comercial Pequeño" },
    ]
  } else {
    return [
      { value: "industrial", label: "Industrial" },
      { value: "manufactura", label: "Manufactura" },
      { value: "químico", label: "Químico" },
      { value: "alimentario", label: "Alimentario" },
      { value: "textil", label: "Textil" },
      { value: "construcción", label: "Construcción" },
      { value: "farmacéutico", label: "Farmacéutico" },
      { value: "automotriz", label: "Automotriz" },
      { value: "comercial", label: "Comercial" },
    ]
  }
}

/**
 * Convierte imagen base64 a blob para almacenamiento
 */
export async function base64ToBlob(base64Data: string): Promise<Blob> {
  const response = await fetch(base64Data)
  return response.blob()
}

/**
 * Guarda imagen en el servidor (simulado - en producción usar servicio de almacenamiento)
 */
export async function saveImageToServer(base64Data: string, wasteId: string): Promise<string | null> {
  try {
    // En producción, aquí subirías la imagen a un servicio como AWS S3, Cloudinary, etc.
    // Por ahora, retornamos la data URL directamente
    return base64Data
  } catch (error) {
    console.error("Error saving image:", error)
    return null
  }
}
